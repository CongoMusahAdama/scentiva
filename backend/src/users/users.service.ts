import { Injectable, OnModuleInit, NotFoundException, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './schemas/user.schema';
import { ProductsService } from '../products/products.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  onModuleInit() {
    this.seedAdmin().catch(err => this.logger.error('Error seeding admin', err));
  }

  sanitizeUser(user: User | null) {
    if (!user) return null;
    const obj = user.toObject();
    delete obj.password;
    delete obj.otp;
    delete obj.otpExpires;
    return obj;
  }

  async deleteAllCustomers(): Promise<number> {
    const result = await this.userModel.deleteMany({ role: UserRole.CUSTOMER }).exec();
    return result.deletedCount;
  }

  private async seedAdmin() {
    try {
      // Remove any dummy admin accounts (e.g. 0000000000)
      await this.userModel.deleteMany({ phone: '0000000000' });

      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin@scentiva!';
      const hashedPassword = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);

      const targetAdmins = [
        {
          phone: '0203154307',
          email: 'admin@scentivaaura.shop',
          fullName: 'Scentiva Admin (0203154307)',
        },
        {
          phone: '0202525739',
          email: 'admin2@scentivaaura.shop',
          fullName: 'Scentiva Admin (+233 20 252 5739)',
        },
        {
          phone: '0257650132',
          email: 'admin3@scentivaaura.shop',
          fullName: 'Scentiva Admin (0257650132)',
        },
      ];

      for (const admin of targetAdmins) {
        const cleanDigits = admin.phone.replace(/\D/g, '');
        const phoneVariants = [
          admin.phone,
          '0' + cleanDigits.slice(-9),
          '+233' + cleanDigits.slice(-9),
          '233' + cleanDigits.slice(-9),
        ];

        const existing = await this.userModel.findOne({
          $or: [
            { phone: { $in: phoneVariants } },
            { email: admin.email },
          ],
        });

        if (!existing) {
          await this.userModel.create({
            phone: admin.phone,
            email: admin.email,
            password: hashedPassword,
            fullName: admin.fullName,
            role: UserRole.ADMIN,
            isVerified: true,
          });
          this.logger.log(`Admin user created: ${admin.phone}`);
        } else {
          existing.password = hashedPassword;
          existing.role = UserRole.ADMIN;
          existing.isVerified = true;
          await existing.save();
          this.logger.log(`Admin user updated & password synced: ${admin.phone}`);
        }
      }
    } catch (error) {
      this.logger.error('Error seeding admin users', error);
    }
  }

  async findByPhone(identifier: string): Promise<User | null> {
    const raw = identifier.trim();
    const cleanDigits = raw.replace(/\D/g, '');
    const variations = [raw];

    if (cleanDigits.length >= 9) {
      const last9 = cleanDigits.slice(-9); // e.g. "203154307" or "202525739"
      variations.push('0' + last9);
      variations.push('+233' + last9);
      variations.push('233' + last9);
      variations.push('+233 ' + last9.slice(0, 2) + ' ' + last9.slice(2, 5) + ' ' + last9.slice(5));
      variations.push('0' + last9.slice(0, 2) + ' ' + last9.slice(2, 5) + ' ' + last9.slice(5));
    }

    return this.userModel.findOne({
      $or: [
        { phone: { $in: variations } },
        { email: raw.toLowerCase() },
      ],
    }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password -otp -otpExpires').exec();
  }

  async update(id: string, updateData: Record<string, unknown>): Promise<User | null> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password -otp -otpExpires')
      .exec();
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User | null> {
    const updateData: Record<string, unknown> = {};
    if (dto.fullName) updateData.fullName = dto.fullName;
    if (dto.email) updateData.email = dto.email;
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    }
    return this.update(id, updateData);
  }

  async updateProfileImage(id: string, profileImage: string): Promise<User | null> {
    return this.update(id, { profileImage });
  }

  async toggleWishlist(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    return user.wishlist;
  }

  async getWishlist(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.wishlist.length) return [];

    return this.productsService.findByIds(user.wishlist);
  }
}
