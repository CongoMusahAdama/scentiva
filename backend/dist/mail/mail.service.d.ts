import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    private resend;
    constructor(configService: ConfigService);
    sendOtp(to: string, otp: string): Promise<void>;
    sendOrderStatusUpdate(to: string, orderId: string, status: string): Promise<void>;
}
