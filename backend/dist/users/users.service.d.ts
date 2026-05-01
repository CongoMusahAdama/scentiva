import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../products/products.service';
export declare class UsersService implements OnModuleInit {
    private userModel;
    private configService;
    private productsService;
    constructor(userModel: Model<User>, configService: ConfigService, productsService: ProductsService);
    onModuleInit(): Promise<void>;
    private seedAdmin;
    findByPhone(identifier: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    findById(id: string): Promise<User | null>;
    update(id: string, updateData: any): Promise<User | null>;
    updateProfileImage(id: string, profileImage: string): Promise<User | null>;
    toggleWishlist(userId: string, productId: string): Promise<string[]>;
    getWishlist(userId: string): Promise<import("../products/schemas/product.schema").Product[]>;
}
