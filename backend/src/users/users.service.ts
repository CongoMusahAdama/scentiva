import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './schemas/user.schema';
import { ProductsService } from '../products/products.service';

export const ADMIN_CREDENTIALS = {
  email: 'amusahcongo@gmail.com',
  phone: '0000000000',
  password: 'Musah@scentivaadmin12345',
} as const;

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
    private productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async deleteAllCustomers(): Promise<number> {
    const result = await this.userModel.deleteMany({ role: UserRole.CUSTOMER }).exec();
    return result.deletedCount;
  }

  private async seedAdmin() {
    const { email: adminEmail, phone: adminPhone, password: adminPassword } = ADMIN_CREDENTIALS;

    try {
      const existingAdmin = await this.userModel.findOne({ 
        $or: [{ email: adminEmail }, { phone: adminPhone }] 
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await this.userModel.create({
          phone: adminPhone,
          email: adminEmail,
          password: hashedPassword,
          fullName: 'Scentiva Admin',
          role: UserRole.ADMIN,
          isVerified: true, // Auto-verify admin on seed
        });
        console.log('✅ Default admin user created');
      } else {
        // Ensure existing admin is verified
        if (existingAdmin.role === UserRole.ADMIN && !existingAdmin.isVerified) {
          existingAdmin.isVerified = true;
          await existingAdmin.save();
          console.log('✅ Default admin user verified');
        }
      }
    } catch (error) {
      if (error.code === 11000) {
        console.warn('⚠️ Admin user already exists (duplicate key). skipping seed.');
      } else {
        console.error('❌ Error seeding admin user:', error);
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
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateData: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async updateProfileImage(id: string, profileImage: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, { profileImage }, { new: true })
      .exec();
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

    // Fetch product details for each ID in wishlist
    const products = await Promise.all(
      user.wishlist.map(id => this.productsService.findOne(id).catch(() => null))
    );
    return products.filter(p => p !== null);
  }
}
