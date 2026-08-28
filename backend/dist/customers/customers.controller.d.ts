import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<any[]>;
    create(customerDto: CustomerDto): Promise<import("./schemas/customer.schema").Customer>;
    delete(id: string): Promise<any>;
}
