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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const mail_service_1 = require("../mail/mail.service");
const users_service_1 = require("../users/users.service");
const sms_service_1 = require("../sms/sms.service");
let OrdersService = class OrdersService {
    constructor(orderModel, mailService, usersService, smsService) {
        this.orderModel = orderModel;
        this.mailService = mailService;
        this.usersService = usersService;
        this.smsService = smsService;
    }
    async create(createOrderDto) {
        const newOrder = new this.orderModel(createOrderDto);
        const savedOrder = await newOrder.save();
        await this.smsService.sendSms(savedOrder.phone, `Your Scentiva Aura order #${savedOrder.id} has been received successfully.`, 'order_placed', savedOrder.id);
        await this.smsService.sendAdminNotification(`New order #${savedOrder.id} – GHS ${savedOrder.amount} – Customer: ${savedOrder.customer}`, 'admin_order_notification', savedOrder.id);
        return savedOrder;
    }
    async findAll(phone) {
        if (phone) {
            return this.orderModel.find({ phone }).exec();
        }
        return this.orderModel.find().exec();
    }
    async findOne(id) {
        const order = await this.orderModel.findOne({ id }).exec();
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const updatedOrder = await this.orderModel
            .findOneAndUpdate({ id }, updateOrderDto, { new: true })
            .exec();
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        this.notifyCustomer(updatedOrder);
        return updatedOrder;
    }
    async notifyCustomer(order) {
        try {
            const user = await this.usersService.findByPhone(order.phone);
            if (user && user.email) {
                await this.mailService.sendOrderStatusUpdate(user.email, order.id, order.status);
            }
            let smsMessage = '';
            let eventType = '';
            switch (order.status) {
                case 'paid':
                    smsMessage = `Payment of GHS ${order.amount} received for your order #${order.id}.`;
                    eventType = 'payment_confirmed';
                    break;
                case 'shipped':
                    smsMessage = `Your Scentiva Aura order #${order.id} is on the way.`;
                    eventType = 'order_shipped';
                    break;
                case 'delivered':
                    smsMessage = `Your order #${order.id} has been delivered. Thank you for choosing Scentiva Aura.`;
                    eventType = 'order_delivered';
                    break;
            }
            if (smsMessage) {
                await this.smsService.sendSms(order.phone, smsMessage, eventType, order.id);
            }
            console.log(`\n📱 PUSH NOTIFICATION (WHATSAPP):`);
            console.log(`To: ${order.phone}`);
            console.log(`Message: Hello ${order.customer}, your Scentiva order ${order.id} is now ${order.status.toUpperCase()}. Track here: https://wa.me/233506626068\n`);
        }
        catch (err) {
            console.error('Notification Error:', err);
        }
    }
    async remove(id) {
        const result = await this.orderModel.deleteOne({ id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mail_service_1.MailService,
        users_service_1.UsersService,
        sms_service_1.SmsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map