import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService);
    private issueToken;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: string;
        };
    }>;
    verifyOtp(phone: string, otp: string): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: string;
        };
    }>;
    resendOtp(phone: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: string;
        };
    }>;
}
