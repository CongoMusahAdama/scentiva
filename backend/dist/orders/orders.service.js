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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const mail_service_1 = require("../mail/mail.service");
const users_service_1 = require("../users/users.service");
const sms_service_1 = require("../sms/sms.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(orderModel, mailService, usersService, smsService) {
        this.orderModel = orderModel;
        this.mailService = mailService;
        this.usersService = usersService;
        this.smsService = smsService;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async create(createOrderDto) {
        const newOrder = new this.orderModel(createOrderDto);
        const savedOrder = await newOrder.save();
        this.sendOrderNotifications(savedOrder).catch((err) => this.logger.error('Order notification error', err));
        return savedOrder;
    }
    async sendOrderNotifications(order) {
        await this.smsService.sendSms(order.phone, `Your Scentiva Aura order #${order.id} has been received successfully.`, 'order_placed', order.id);
        await this.smsService.sendAdminNotification(`New order #${order.id} – GHS ${order.amount} – Customer: ${order.customer}`, 'admin_order_notification', order.id);
    }
    async findAll(phone, page = 1, limit = 50) {
        const query = phone ? { phone } : {};
        const safeLimit = Math.min(Math.max(limit, 1), 100);
        const skip = (Math.max(page, 1) - 1) * safeLimit;
        return this.orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).exec();
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
            this.logger.log(`Order ${order.id} status updated to ${order.status} for ${order.phone}`);
        }
        catch (err) {
            this.logger.error('Notification Error', err);
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
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mail_service_1.MailService,
        users_service_1.UsersService,
        sms_service_1.SmsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map