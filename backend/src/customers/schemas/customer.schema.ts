import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: 0 })
  orders: number;

  @Prop({ required: true })
  referralCode: string;

  @Prop({ required: true })
  joined: string;

  @Prop({ required: true, default: 'GHS 0' })
  totalSpent: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
