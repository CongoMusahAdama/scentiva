import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getDashboardOverview() {
    // For now, only users exist. Once we build Order and Product schemas, we will replace these constants with actual aggregations.
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

    // To make it simple: Net Profit = Revenue - (Total Cost of goods sold).
    // Let's get all products to map cost prices.
    const allProducts = await this.productModel.find();
    const productCostMap = new Map();
    allProducts.forEach(p => productCostMap.set(p.name, p.costPrice || 0));

    let netProfit = 0;
    for (const order of orders) {
       const cost = productCostMap.get(order.products) || 0;
       const numAmount = Number(order.amount.replace(/[^0-9.]/g, ''));
       netProfit += (numAmount - cost);
    }

    // Structure matching what the frontend expects
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
          { label: "Mon", value: 0 }, { label: "Tue", value: 0 }, { label: "Wed", value: 0 },
          { label: "Thu", value: 0 }, { label: "Fri", value: 0 }, { label: "Sat", value: 0 },
          { label: "Sun", value: 0 },
        ],
        "30d": [
          { label: "Week 1", value: 0 }, { label: "Week 2", value: 0 }, { label: "Week 3", value: 0 },
          { label: "Week 4", value: 0 }
        ],
        "90d": [
          { label: "Month 1", value: 0 }, { label: "Month 2", value: 0 }, { label: "Month 3", value: 0 },
        ],
      },
      recentOrders: [],
      alerts: [
        { label: "Reviews pending", value: "0", color: "#F59E0B" },
        { label: "Low stock items", value: "0", color: "#EF4444" },
        { label: "Referrals active", value: "0", color: "#10B981" },
        { label: "New customers", value: newCustomers.toString(), color: "#D8B34B" },
      ]
    };
  }
}
