import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from './schemas/user.schema';
import { ProductsService } from '../products/products.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService implements OnModuleInit {
    private userModel;
    private configService;
    private productsService;
    private readonly logger;
    constructor(userModel: Model<User>, configService: ConfigService, productsService: ProductsService);
    onModuleInit(): Promise<void>;
    sanitizeUser(user: User | null): any;
    deleteAllCustomers(): Promise<number>;
    private seedAdmin;
    findByPhone(identifier: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    findById(id: string): Promise<User | null>;
    update(id: string, updateData: Record<string, unknown>): Promise<User | null>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<User | null>;
    updateProfileImage(id: string, profileImage: string): Promise<User | null>;
    toggleWishlist(userId: string, productId: string): Promise<string[]>;
    getWishlist(userId: string): Promise<import("../products/schemas/product.schema").Product[]>;
}
