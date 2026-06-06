"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.ADMIN_CREDENTIALS = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
exports.ADMIN_CREDENTIALS = {
    email: 'amusahcongo@gmail.com',
    phone: '0000000000',
    password: 'Musah@scentivaadmin12345',
};
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const products_service_1 = require("../products/products.service");
let UsersService = class UsersService {
    constructor(userModel, configService, productsService) {
        this.userModel = userModel;
        this.configService = configService;
        this.productsService = productsService;
    }
    async onModuleInit() {
        await this.seedAdmin();
    }
    async seedAdmin() {
        const adminEmail = 'amusahcongo@gmail.com';
        const adminPhone = '0000000000';
        const adminPassword = 'Musah@scentivaadmin12345';
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
                    role: user_schema_1.UserRole.ADMIN,
                    isVerified: true,
                });
                console.log('✅ Default admin user created');
            }
            else {
                if (existingAdmin.role === user_schema_1.UserRole.ADMIN && !existingAdmin.isVerified) {
                    existingAdmin.isVerified = true;
                    await existingAdmin.save();
                    console.log('✅ Default admin user verified');
                }
            }
        }
        catch (error) {
            if (error.code === 11000) {
                console.warn('⚠️ Admin user already exists (duplicate key). skipping seed.');
            }
            else {
                console.error('❌ Error seeding admin user:', error);
            }
        }
    }
    async findByPhone(identifier) {
        return this.userModel.findOne({
            $or: [{ phone: identifier }, { email: identifier }],
        }).exec();
    }
    async create(userData) {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async update(id, updateData) {
        return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async updateProfileImage(id, profileImage) {
        return this.userModel
            .findByIdAndUpdate(id, { profileImage }, { new: true })
            .exec();
    }
    async toggleWishlist(userId, productId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
        }
        else {
            user.wishlist.push(productId);
        }
        await user.save();
        return user.wishlist;
    }
    async getWishlist(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const products = await Promise.all(user.wishlist.map(id => this.productsService.findOne(id).catch(() => null)));
        return products.filter(p => p !== null);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        products_service_1.ProductsService])
], UsersService);
//# sourceMappingURL=users.service.js.map