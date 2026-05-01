import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./schemas/order.schema").Order>;
    findAll(phone?: string): Promise<import("./schemas/order.schema").Order[]>;
    findOne(id: string): Promise<import("./schemas/order.schema").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./schemas/order.schema").Order>;
    remove(id: string): Promise<void>;
}
