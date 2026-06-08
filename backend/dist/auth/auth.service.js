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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../users/schemas/user.schema");
const BCRYPT_ROUNDS = 10;
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    issueToken(user) {
        const payload = { phone: user.phone, sub: user._id.toString(), role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id.toString(),
                phone: user.phone,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
    async register(registerDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, BCRYPT_ROUNDS);
        const existingUser = await this.usersService.findByPhone(registerDto.phone);
        if (existingUser) {
            if (existingUser.isVerified) {
                throw new common_1.ConflictException('User already exists');
            }
            const user = await this.usersService.update(existingUser._id.toString(), {
                email: registerDto.email,
                fullName: registerDto.fullName,
                password: hashedPassword,
                isVerified: true,
                role: user_schema_1.UserRole.CUSTOMER,
            });
            if (!user)
                throw new common_1.BadRequestException('User not found');
            return this.issueToken(user);
        }
        let user;
        try {
            user = await this.usersService.create({
                phone: registerDto.phone,
                email: registerDto.email,
                fullName: registerDto.fullName,
                password: hashedPassword,
                isVerified: true,
                role: user_schema_1.UserRole.CUSTOMER,
            });
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('Email is already registered with another account');
            }
            throw error;
        }
        return this.issueToken(user);
    }
    async verifyOtp(phone, otp) {
        const user = await this.usersService.findByPhone(phone);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const isMatch = user.otp === otp;
        if (!isMatch) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        if (!user.otpExpires || user.otpExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return this.issueToken(user);
    }
    async resendOtp(phone) {
        const user = await this.usersService.findByPhone(phone);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        this.logger.log(`OTP resent for ${user.phone}`);
        return { message: 'OTP sent successfully' };
    }
    async login(loginDto) {
        const user = await this.usersService.findByPhone(loginDto.phone);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isVerified) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.issueToken(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map