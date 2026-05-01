import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
export declare class AdminService {
    private userModel;
    private orderModel;
    private productModel;
    constructor(userModel: Model<User>, orderModel: Model<Order>, productModel: Model<Product>);
    getDashboardOverview(): Promise<{
        stats: {
            totalProducts: number;
            totalOrders: number;
            revenue: number;
            netProfit: number;
            activeCustomers: number;
        };
        chartData: {
            "7d": {
                label: string;
                value: number;
            }[];
            "30d": {
                label: string;
                value: number;
            }[];
            "90d": {
                label: string;
                value: number;
            }[];
        };
        recentOrders: never[];
        alerts: {
            label: string;
            value: string;
            color: string;
        }[];
    }>;
}
