import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { User } from '../users/schemas/user.schema';
import { Order } from '../orders/schemas/order.schema';
import { CustomerDto } from './dto/customer.dto';
export declare class CustomersService {
    private customerModel;
    private userModel;
    private orderModel;
    constructor(customerModel: Model<Customer>, userModel: Model<User>, orderModel: Model<Order>);
    findAll(): Promise<any[]>;
    create(customerDto: CustomerDto): Promise<Customer>;
    delete(id: string): Promise<any>;
    deleteAll(): Promise<number>;
}
