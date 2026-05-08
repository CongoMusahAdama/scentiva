import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    private smsService;
    constructor(usersService: UsersService, jwtService: JwtService, mailService: MailService, smsService: SmsService);
    register(registerDto: RegisterDto): Promise<any>;
    verifyOtp(phone: string, otp: string): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: import("../users/schemas/user.schema").UserRole;
        };
    }>;
    resendOtp(phone: string): Promise<{
        message: string;
        otp: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: import("../users/schemas/user.schema").UserRole;
        };
    } | {
        requiresVerification: boolean;
        phone: string;
        otp: string;
        message: string;
    }>;
}
