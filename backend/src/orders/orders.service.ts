import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private mailService: MailService,
    private usersService: UsersService,
    private smsService: SmsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new this.orderModel(createOrderDto);
    const savedOrder = await newOrder.save();

    this.sendOrderNotifications(savedOrder).catch((err) =>
      this.logger.error('Order notification error', err),
    );

    return savedOrder;
  }

  private async sendOrderNotifications(order: Order) {
    await this.smsService.sendSms(
      order.phone,
      `Your Scentiva Aura order #${order.id} has been received successfully.`,
      'order_placed',
      order.id,
    );
    await this.smsService.sendAdminNotification(
      `New order #${order.id} – GHS ${order.amount} – Customer: ${order.customer}`,
      'admin_order_notification',
      order.id,
    );
  }

  async findAll(phone?: string, page = 1, limit = 50): Promise<Order[]> {
    const query = phone ? { phone } : {};
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (Math.max(page, 1) - 1) * safeLimit;
    return this.orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findOne({ id }).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate({ id }, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Trigger Notifications
    this.notifyCustomer(updatedOrder);

    return updatedOrder;
  }

  private async notifyCustomer(order: Order) {
    try {
      // Find user to get email
      const user = await this.usersService.findByPhone(order.phone);
      
      if (user && user.email) {
        await this.mailService.sendOrderStatusUpdate(user.email, order.id, order.status);
      }

      // SMS Notifications based on status
      let smsMessage = '';
      let eventType = '';

      switch (order.status) {
        case 'paid':
          smsMessage = `Payment of GHS ${order.amount} received for your order #${order.id}.`;
          eventType = 'payment_confirmed';
          break;
        case 'shipped':
          smsMessage = `Your Scentiva Aura order #${order.id} is on the way.`;
          eventType = 'order_shipped';
          break;
        case 'delivered':
          smsMessage = `Your order #${order.id} has been delivered. Thank you for choosing Scentiva Aura.`;
          eventType = 'order_delivered';
          break;
      }

      if (smsMessage) {
        await this.smsService.sendSms(order.phone, smsMessage, eventType, order.id);
      }

      this.logger.log(`Order ${order.id} status updated to ${order.status} for ${order.phone}`);
    } catch (err) {
      this.logger.error('Notification Error', err);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
