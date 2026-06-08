import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { SmsService } from '../sms/sms.service';
export declare class OrdersService {
    private orderModel;
    private mailService;
    private usersService;
    private smsService;
    private readonly logger;
    constructor(orderModel: Model<Order>, mailService: MailService, usersService: UsersService, smsService: SmsService);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    private sendOrderNotifications;
    findAll(phone?: string, page?: number, limit?: number): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    private notifyCustomer;
    remove(id: string): Promise<void>;
}
