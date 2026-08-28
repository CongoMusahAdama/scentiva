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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
let CustomersService = class CustomersService {
    constructor(customerModel, userModel, orderModel) {
        this.customerModel = customerModel;
        this.userModel = userModel;
        this.orderModel = orderModel;
    }
    async findAll() {
        const explicitCustomers = await this.customerModel.find().exec();
        const registeredUsers = await this.userModel
            .find({ role: user_schema_1.UserRole.CUSTOMER })
            .exec();
        const orders = await this.orderModel.find().exec();
        const phoneOrderStats = new Map();
        for (const order of orders) {
            const cleanPhone = (order.phone || '').replace(/\D/g, '');
            const numAmount = Number((order.amount || '').replace(/[^0-9.]/g, '')) || 0;
            const current = phoneOrderStats.get(cleanPhone) || { count: 0, total: 0 };
            phoneOrderStats.set(cleanPhone, {
                count: current.count + 1,
                total: current.total + numAmount,
            });
        }
        const seenPhones = new Set();
        const result = [];
        for (const user of registeredUsers) {
            const cleanPhone = (user.phone || '').replace(/\D/g, '');
            seenPhones.add(cleanPhone);
            const stats = phoneOrderStats.get(cleanPhone) || { count: 0, total: 0 };
            const joinedDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                    month: 'short',
                    year: 'numeric',
                })
                : 'Recent';
            result.push({
                _id: user._id.toString(),
                name: user.fullName || 'Registered User',
                phone: user.phone,
                orders: stats.count,
                referralCode: 'SC-' + cleanPhone.slice(-4).toUpperCase(),
                joined: joinedDate,
                totalSpent: `GHS ${stats.total.toLocaleString()}`,
            });
        }
        for (const cust of explicitCustomers) {
            const cleanPhone = (cust.phone || '').replace(/\D/g, '');
            if (!seenPhones.has(cleanPhone)) {
                seenPhones.add(cleanPhone);
                const stats = phoneOrderStats.get(cleanPhone) || { count: cust.orders || 0, total: 0 };
                result.push({
                    _id: cust._id.toString(),
                    name: cust.name,
                    phone: cust.phone,
                    orders: Math.max(cust.orders || 0, stats.count),
                    referralCode: cust.referralCode || 'SC-' + cleanPhone.slice(-4),
                    joined: cust.joined || 'Recent',
                    totalSpent: cust.totalSpent || `GHS ${stats.total.toLocaleString()}`,
                });
            }
        }
        return result;
    }
    async create(customerDto) {
        const createdCustomer = new this.customerModel(customerDto);
        return createdCustomer.save();
    }
    async delete(id) {
        const cust = await this.customerModel.findByIdAndDelete(id).exec();
        const usr = await this.userModel.findByIdAndDelete(id).exec();
        return cust || usr || { success: true };
    }
    async deleteAll() {
        const result = await this.customerModel.deleteMany({}).exec();
        await this.userModel.deleteMany({ role: user_schema_1.UserRole.CUSTOMER }).exec();
        return result.deletedCount;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CustomersService);
//# sourceMappingURL=customers.service.js.map