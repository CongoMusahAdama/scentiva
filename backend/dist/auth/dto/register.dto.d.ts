import { UserRole } from '../../users/schemas/user.schema';
export declare class RegisterDto {
    phone: string;
    email?: string;
    password: string;
    fullName: string;
    role?: UserRole;
}
