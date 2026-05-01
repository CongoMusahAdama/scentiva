import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { SmsLog } from './sms-log.schema';
export declare class SmsService {
    private configService;
    private smsLogModel;
    private readonly logger;
    private readonly apiKey;
    private readonly senderId;
    constructor(configService: ConfigService, smsLogModel: Model<SmsLog>);
    private formatPhoneNumber;
    sendSms(to: string, message: string, eventType: string, referenceId?: string): Promise<void>;
    sendAdminNotification(message: string, eventType: string, referenceId?: string): Promise<void>;
}
