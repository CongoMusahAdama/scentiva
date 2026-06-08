import { Injectable, OnModuleInit, NotFoundException, Logger } from '@nestjs/common';
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
    private productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
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
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPhone = this.configService.get<string>('ADMIN_PHONE');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPhone || !adminPassword) {
      this.logger.warn('Admin seed skipped — set ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD in env');
      return;
    }

    try {
      const existingAdmin = await this.userModel.findOne({
        $or: [{ email: adminEmail }, { phone: adminPhone }],
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);
        await this.userModel.create({
          phone: adminPhone,
          email: adminEmail,
          password: hashedPassword,
          fullName: 'Scentiva Admin',
          role: UserRole.ADMIN,
          isVerified: true,
        });
        this.logger.log('Default admin user created');
      } else if (existingAdmin.role === UserRole.ADMIN && !existingAdmin.isVerified) {
        existingAdmin.isVerified = true;
        await existingAdmin.save();
        this.logger.log('Default admin user verified');
      }
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn('Admin user already exists — skipping seed');
      } else {
        this.logger.error('Error seeding admin user', error);
      }
    }
  }

  async findByPhone(identifier: string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
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
