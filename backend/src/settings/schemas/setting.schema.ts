import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ required: true, default: 'Scentiva Aura' })
  storeName: string;

  @Prop({ required: true, default: 'Own your scent.' })
  tagline: string;

  @Prop({ required: true, default: 'hello@scentivaaura.com' })
  email: string;

  @Prop({ required: true, default: '020 315 4307' })
  whatsapp: string;

  @Prop({ required: true, default: '@scentivaaura' })
  socialHandle: string;

  @Prop({ required: true, default: 'Takoradi, Ghana' })
  address: string;

  @Prop({ required: true, default: 'GHS' })
  currency: string;

  @Prop({ required: true, default: 'Orders are processed within 24 hours and delivered in 1–3 business days.' })
  deliveryNote: string;

  @Prop({ required: true, default: '10' })
  referralReward: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
