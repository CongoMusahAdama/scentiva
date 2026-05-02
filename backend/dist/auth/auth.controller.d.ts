import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        requiresVerification: boolean;
        phone: string;
        otp: string;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: import("../users/schemas/user.schema").UserRole;
        };
        requiresVerification?: undefined;
        phone?: undefined;
        otp?: undefined;
        message?: undefined;
    }>;
    verifyOtp(body: {
        phone: string;
        otp: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            phone: string;
            fullName: string;
            role: import("../users/schemas/user.schema").UserRole;
        };
    }>;
    resendOtp(body: {
        phone: string;
    }): Promise<{
        message: string;
        otp: string;
    }>;
    getProfile(req: any): any;
}
