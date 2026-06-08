import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ customer: 1 });
