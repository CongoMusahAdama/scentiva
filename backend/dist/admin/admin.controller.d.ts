import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getOverview(): Promise<{
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
        recentOrders: {
            id: string;
            customer: string;
            product: string;
            amount: string;
            status: string;
            date: string;
        }[];
        alerts: {
            label: string;
            value: string;
            color: string;
        }[];
    }>;
}
