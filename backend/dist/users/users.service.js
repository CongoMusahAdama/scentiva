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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
const products_service_1 = require("../products/products.service");
const BCRYPT_ROUNDS = 10;
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel, configService, productsService) {
        this.userModel = userModel;
        this.configService = configService;
        this.productsService = productsService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    onModuleInit() {
        this.seedAdmin().catch(err => this.logger.error('Error seeding admin', err));
    }
    sanitizeUser(user) {
        if (!user)
            return null;
        const obj = user.toObject();
        delete obj.password;
        delete obj.otp;
        delete obj.otpExpires;
        return obj;
    }
    async deleteAllCustomers() {
        const result = await this.userModel.deleteMany({ role: user_schema_1.UserRole.CUSTOMER }).exec();
        return result.deletedCount;
    }
    async seedAdmin() {
        try {
            await this.userModel.deleteMany({ phone: '0000000000' });
            const adminPassword = this.configService.get('ADMIN_PASSWORD') || 'admin@scentiva!';
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
                        role: user_schema_1.UserRole.ADMIN,
                        isVerified: true,
                    });
                    this.logger.log(`Admin user created: ${admin.phone}`);
                }
                else {
                    existing.password = hashedPassword;
                    existing.role = user_schema_1.UserRole.ADMIN;
                    existing.isVerified = true;
                    await existing.save();
                    this.logger.log(`Admin user updated & password synced: ${admin.phone}`);
                }
            }
        }
        catch (error) {
            this.logger.error('Error seeding admin users', error);
        }
    }
    async findByPhone(identifier) {
        const raw = identifier.trim();
        const cleanDigits = raw.replace(/\D/g, '');
        const variations = [raw];
        if (cleanDigits.length >= 9) {
            const last9 = cleanDigits.slice(-9);
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
    async create(userData) {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }
    async findById(id) {
        return this.userModel.findById(id).select('-password -otp -otpExpires').exec();
    }
    async update(id, updateData) {
        const user = await this.userModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .select('-password -otp -otpExpires')
            .exec();
        return user;
    }
    async updateProfile(id, dto) {
        const updateData = {};
        if (dto.fullName)
            updateData.fullName = dto.fullName;
        if (dto.email)
            updateData.email = dto.email;
        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        }
        return this.update(id, updateData);
    }
    async updateProfileImage(id, profileImage) {
        return this.update(id, { profileImage });
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
        if (!user.wishlist.length)
            return [];
        return this.productsService.findByIds(user.wishlist);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => products_service_1.ProductsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        products_service_1.ProductsService])
], UsersService);
//# sourceMappingURL=users.service.js.map