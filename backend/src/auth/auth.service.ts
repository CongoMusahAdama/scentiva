import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/schemas/user.schema';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private issueToken(user: { _id: { toString(): string }; phone: string; fullName: string; role: string }) {
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

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, BCRYPT_ROUNDS);
    const existingUser = await this.usersService.findByPhone(registerDto.phone);

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ConflictException('User already exists');
      }

      const user = await this.usersService.update(existingUser._id.toString(), {
        email: registerDto.email,
        fullName: registerDto.fullName,
        password: hashedPassword,
        isVerified: true,
        role: UserRole.CUSTOMER,
      });
      if (!user) throw new BadRequestException('User not found');

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
        role: UserRole.CUSTOMER,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email is already registered with another account');
      }
      throw error;
    }

    return this.issueToken(user);
  }

  async verifyOtp(phone: string, otp: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new BadRequestException('User not found');

    const isMatch = user.otp === otp;
    if (!isMatch) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return this.issueToken(user);
  }

  async resendOtp(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    this.logger.log(`OTP resent for ${user.phone}`);

    return { message: 'OTP sent successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByPhone(loginDto.phone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueToken(user);
  }
}
