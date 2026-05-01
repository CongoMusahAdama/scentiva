import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { SmsLog } from './sms-log.schema';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;
  private readonly senderId: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(SmsLog.name) private smsLogModel: Model<SmsLog>,
  ) {
    this.apiKey = this.configService.get<string>('MNOTIFY_API_KEY') || '';
    this.senderId = this.configService.get<string>('MNOTIFY_SENDER_ID') || 'Scentiva';
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Handle 0XXXXXXXXX format
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '233' + cleaned.substring(1);
    }
    // Handle XXXXXXXXX format (assume 233 is missing)
    else if (cleaned.length === 9) {
      cleaned = '233' + cleaned;
    }
    // Handle +233XXXXXXXXX or 233XXXXXXXXX (already correct)
    else if (cleaned.startsWith('233') && cleaned.length === 12) {
      // already correct
    }

    return cleaned;
  }

  async sendSms(to: string, message: string, eventType: string, referenceId?: string) {
    const formattedPhone = this.formatPhoneNumber(to);
    
    // Check for duplicate SMS for the same event and reference
    if (referenceId) {
      const existingLog = await this.smsLogModel.findOne({
        recipient: formattedPhone,
        eventType,
        referenceId,
        status: 'sent',
      });

      if (existingLog) {
        this.logger.warn(`Duplicate SMS prevented for ${eventType} to ${formattedPhone} (Ref: ${referenceId})`);
        return;
      }
    }

    const log = new this.smsLogModel({
      recipient: formattedPhone,
      message,
      status: 'pending',
      eventType,
      referenceId,
    });
    await log.save();

    try {
      const response = await axios.post(
        `https://api.mnotify.com/api/sms/quick?key=${this.apiKey}`,
        {
          recipient: [formattedPhone],
          sender: this.senderId,
          message: message,
          is_schedule: false,
        }
      );

      log.status = response.data.code === '1000' ? 'sent' : 'failed';
      log.providerResponse = JSON.stringify(response.data);
      await log.save();

      if (log.status === 'sent') {
        this.logger.log(`SMS sent successfully to ${formattedPhone}`);
      } else {
        this.logger.error(`SMS failed to ${formattedPhone}: ${log.providerResponse}`);
      }
    } catch (error) {
      log.status = 'failed';
      log.providerResponse = error.message;
      await log.save();
      this.logger.error(`Error sending SMS to ${formattedPhone}: ${error.message}`);
    }
  }

  async sendAdminNotification(message: string, eventType: string, referenceId?: string) {
    const adminPhone = this.configService.get<string>('ADMIN_PHONE_NOTIFICATION');
    if (adminPhone) {
      await this.sendSms(adminPhone, message, eventType, referenceId);
    }
  }
}
