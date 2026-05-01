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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("axios");
const sms_log_schema_1 = require("./sms-log.schema");
let SmsService = SmsService_1 = class SmsService {
    constructor(configService, smsLogModel) {
        this.configService = configService;
        this.smsLogModel = smsLogModel;
        this.logger = new common_1.Logger(SmsService_1.name);
        this.apiKey = this.configService.get('MNOTIFY_API_KEY') || '';
        this.senderId = this.configService.get('MNOTIFY_SENDER_ID') || 'Scentiva';
    }
    formatPhoneNumber(phone) {
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0') && cleaned.length === 10) {
            cleaned = '233' + cleaned.substring(1);
        }
        else if (cleaned.length === 9) {
            cleaned = '233' + cleaned;
        }
        else if (cleaned.startsWith('233') && cleaned.length === 12) {
        }
        return cleaned;
    }
    async sendSms(to, message, eventType, referenceId) {
        const formattedPhone = this.formatPhoneNumber(to);
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
            const response = await axios_1.default.post(`https://api.mnotify.com/api/sms/quick?key=${this.apiKey}`, {
                recipient: [formattedPhone],
                sender: this.senderId,
                message: message,
                is_schedule: false,
            });
            log.status = response.data.code === '1000' ? 'sent' : 'failed';
            log.providerResponse = JSON.stringify(response.data);
            await log.save();
            if (log.status === 'sent') {
                this.logger.log(`SMS sent successfully to ${formattedPhone}`);
            }
            else {
                this.logger.error(`SMS failed to ${formattedPhone}: ${log.providerResponse}`);
            }
        }
        catch (error) {
            log.status = 'failed';
            log.providerResponse = error.message;
            await log.save();
            this.logger.error(`Error sending SMS to ${formattedPhone}: ${error.message}`);
        }
    }
    async sendAdminNotification(message, eventType, referenceId) {
        const adminPhone = this.configService.get('ADMIN_PHONE_NOTIFICATION');
        if (adminPhone) {
            await this.sendSms(adminPhone, message, eventType, referenceId);
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(sms_log_schema_1.SmsLog.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], SmsService);
//# sourceMappingURL=sms.service.js.map