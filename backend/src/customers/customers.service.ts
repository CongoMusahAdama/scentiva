import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async create(customerDto: CustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(customerDto);
    return createdCustomer.save();
  }

  async delete(id: string): Promise<Customer> {
    const customer = await this.customerModel.findByIdAndDelete(id).exec();
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }
}
