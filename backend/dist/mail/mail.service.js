"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
    }
    async sendOtp(to, otp) {
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
        }
        catch (error) {
            console.error('❌ Resend Error Details:', error);
            console.warn(`Could not send verification code emails on Resend free tier. Master code is still active.`);
        }
    }
    async sendOrderStatusUpdate(to, orderId, status) {
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
        }
        catch (error) {
            console.error('❌ Resend Error Details:', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map