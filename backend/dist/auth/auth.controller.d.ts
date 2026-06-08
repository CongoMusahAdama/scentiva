import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: string;
        };
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
    verifyOtp(body: VerifyOtpDto): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: string;
        };
    }>;
    resendOtp(body: ResendOtpDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): any;
}
