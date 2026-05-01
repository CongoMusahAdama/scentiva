import { CustomersService } from './customers.service';
import { CustomerDto } from './dto/customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<import("./schemas/customer.schema").Customer[]>;
    create(customerDto: CustomerDto): Promise<import("./schemas/customer.schema").Customer>;
    delete(id: string): Promise<import("./schemas/customer.schema").Customer>;
}
