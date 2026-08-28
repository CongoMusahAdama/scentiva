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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const product_schema_1 = require("../products/schemas/product.schema");
let AdminService = class AdminService {
    constructor(userModel, orderModel, productModel) {
        this.userModel = userModel;
        this.orderModel = orderModel;
        this.productModel = productModel;
    }
    async getDashboardOverview() {
        const activeCustomers = await this.userModel.countDocuments({ role: 'CUSTOMER' });
        const newCustomers = await this.userModel.countDocuments({
            role: 'CUSTOMER',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });
        const totalProducts = await this.productModel.countDocuments();
        const orders = await this.orderModel.find({ status: { $in: ['pending', 'paid', 'delivered'] } });
        const totalOrders = orders.length;
        let revenue = 0;
        for (const order of orders) {
            const numAmount = Number(order.amount.replace(/[^0-9.]/g, ''));
            revenue += numAmount;
        }
        const allProducts = await this.productModel.find();
        const productCostMap = new Map();
        allProducts.forEach(p => productCostMap.set(p.name, p.costPrice || 0));
        let netProfit = 0;
        for (const order of orders) {
            const cost = productCostMap.get(order.products) || 0;
            const numAmount = Number(order.amount.replace(/[^0-9.]/g, ''));
            netProfit += (numAmount - cost);
        }
        const recentOrders = await this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .exec();
        const lowStockCount = await this.productModel.countDocuments({ status: 'sold-out' });
        return {
            stats: {
                totalProducts,
                totalOrders,
                revenue,
                netProfit,
                activeCustomers,
            },
            chartData: {
                "7d": [
                    { label: "Mon", value: Math.round(revenue * 0.1) },
                    { label: "Tue", value: Math.round(revenue * 0.15) },
                    { label: "Wed", value: Math.round(revenue * 0.1) },
                    { label: "Thu", value: Math.round(revenue * 0.2) },
                    { label: "Fri", value: Math.round(revenue * 0.25) },
                    { label: "Sat", value: Math.round(revenue * 0.15) },
                    { label: "Sun", value: Math.round(revenue * 0.05) },
                ],
                "30d": [
                    { label: "Week 1", value: Math.round(revenue * 0.2) },
                    { label: "Week 2", value: Math.round(revenue * 0.3) },
                    { label: "Week 3", value: Math.round(revenue * 0.25) },
                    { label: "Week 4", value: Math.round(revenue * 0.25) }
                ],
                "90d": [
                    { label: "Month 1", value: Math.round(revenue * 0.3) },
                    { label: "Month 2", value: Math.round(revenue * 0.35) },
                    { label: "Month 3", value: Math.round(revenue * 0.35) },
                ],
            },
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                customer: o.customer,
                product: o.products,
                amount: o.amount,
                status: o.status,
                date: o.date,
            })),
            alerts: [
                { label: "Reviews pending", value: "0", color: "#F59E0B" },
                { label: "Sold out / Low stock", value: lowStockCount.toString(), color: "#EF4444" },
                { label: "Referrals active", value: "0", color: "#10B981" },
                { label: "New customers (30d)", value: newCustomers.toString(), color: "#D8B34B" },
            ]
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map