import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CustomerDto } from './dto/customer.dto';
export declare class CustomersService {
    private customerModel;
    constructor(customerModel: Model<Customer>);
    findAll(): Promise<Customer[]>;
    create(customerDto: CustomerDto): Promise<Customer>;
    delete(id: string): Promise<Customer>;
    deleteAll(): Promise<number>;
}
