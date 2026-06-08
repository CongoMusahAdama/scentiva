import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  products: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' })
  status: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ phone: 1 });
OrderSchema.index({ status: 1 });
