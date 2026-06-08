import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendOtp(to: string, otp: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] OTP sent to ${to}`);
    }

    try {
      await this.resend.emails.send({
        from: 'Scentiva Aura <onboarding@resend.dev>',
        to: to,
        subject: 'Your Scentiva Verification Code',
        html: `
          <div style="font-family: 'Lora', serif; padding: 20px; color: #1A1B23;">
            <h2 style="color: #D8B34B;">Welcome to Scentiva Aura</h2>
            <p>Your signature profile is almost ready. Use the code below to verify your account:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: #F9F7F2; text-align: center; border: 1px solid #D8B34B;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">This code will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('❌ Resend Error Details:', error);
      console.warn(`Could not send verification code emails on Resend free tier. Master code is still active.`);
    }
  }

  async sendOrderStatusUpdate(to: string, orderId: string, status: string) {
    console.log(`\n\n========================================`);
    console.log(` ORDER STATUS UPDATE: ${orderId} -> ${status.toUpperCase()}`);
    console.log(`========================================\n\n`);

    try {
      await this.resend.emails.send({
        from: 'Scentiva Orders <onboarding@resend.dev>',
        to: to,
        subject: `Update on your Scentiva Order ${orderId}`,
        html: `
          <div style="font-family: 'Lora', serif; padding: 20px; color: #1A1B23;">
            <h2 style="color: #D8B34B;">Order Status Update</h2>
            <p>Hello,</p>
            <p>Your order <strong>${orderId}</strong> has been updated to:</p>
            <div style="font-size: 24px; font-weight: bold; padding: 15px; background: #F9F7F2; text-align: center; border: 1px solid #D8B34B; text-transform: uppercase; margin: 20px 0;">
              ${status}
            </div>
            <p>You can track your order status in your dashboard.</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">Thank you for choosing Scentiva.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('❌ Resend Error Details:', error);
    }
  }
}
