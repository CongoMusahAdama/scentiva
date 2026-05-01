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
    constructor(orderModel: Model<Order>, mailService: MailService, usersService: UsersService, smsService: SmsService);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(phone?: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    private notifyCustomer;
    remove(id: string): Promise<void>;
}
