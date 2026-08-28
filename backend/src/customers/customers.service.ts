import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { User, UserRole } from '../users/schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async findAll(): Promise<any[]> {
    // 1. Get dedicated customer records
    const explicitCustomers = await this.customerModel.find().exec();

    // 2. Get registered customer users
    const registeredUsers = await this.userModel
      .find({ role: UserRole.CUSTOMER })
      .exec();

    // 3. Get all orders to calculate real orders & spend per customer phone
    const orders = await this.orderModel.find().exec();
    const phoneOrderStats = new Map<string, { count: number; total: number }>();

    for (const order of orders) {
      const cleanPhone = (order.phone || '').replace(/\D/g, '');
      const numAmount = Number((order.amount || '').replace(/[^0-9.]/g, '')) || 0;
      const current = phoneOrderStats.get(cleanPhone) || { count: 0, total: 0 };
      phoneOrderStats.set(cleanPhone, {
        count: current.count + 1,
        total: current.total + numAmount,
      });
    }

    const seenPhones = new Set<string>();
    const result: any[] = [];

    // Add registered users
    for (const user of registeredUsers) {
      const cleanPhone = (user.phone || '').replace(/\D/g, '');
      seenPhones.add(cleanPhone);
      const stats = phoneOrderStats.get(cleanPhone) || { count: 0, total: 0 };
      const joinedDate = (user as any).createdAt
        ? new Date((user as any).createdAt).toLocaleDateString('en-GB', {
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

    // Add dedicated customer records that haven't been added yet
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

  async create(customerDto: CustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(customerDto);
    return createdCustomer.save();
  }

  async delete(id: string): Promise<any> {
    const cust = await this.customerModel.findByIdAndDelete(id).exec();
    const usr = await this.userModel.findByIdAndDelete(id).exec();
    return cust || usr || { success: true };
  }

  async deleteAll(): Promise<number> {
    const result = await this.customerModel.deleteMany({}).exec();
    await this.userModel.deleteMany({ role: UserRole.CUSTOMER }).exec();
    return result.deletedCount;
  }
}
