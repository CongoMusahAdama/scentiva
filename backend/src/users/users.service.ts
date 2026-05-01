import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ProductsService } from '../products/products.service';

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

  private async seedAdmin() {
    const adminEmail = 'amusahcongo@gmail.com';
    const adminPassword = 'Musah@scentivaadmin12345';

    const existingAdmin = await this.userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.userModel.create({
        phone: '0000000000',
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Scentiva Admin',
        role: UserRole.ADMIN,
        isVerified: false,
      });
      console.log('✅ Default admin user created');
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
