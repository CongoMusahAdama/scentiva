import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SmsLog extends Document {
  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  status: string; // 'pending', 'sent', 'failed'

  @Prop()
  providerResponse: string;

  @Prop()
  eventType: string; // 'signup', 'order_placed', 'payment_confirmed', etc.

  @Prop()
  referenceId: string; // orderId or userId
}

export const SmsLogSchema = SchemaFactory.createForClass(SmsLog);
