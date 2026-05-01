import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  actual: number;

  @Prop({ required: true })
  original: number;

  @Prop({ required: false, default: 0 })
  costPrice: number;

  @Prop({ required: true })
  tag: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  image2?: string;

  @Prop({ required: true })
  desc: string;

  @Prop([String])
  pros: string[];

  @Prop([String])
  cons: string[];

  @Prop([{ icon: String, label: String, detail: String }])
  whenToApply: { icon: string; label: string; detail: string }[];

  @Prop({ required: true })
  perfectOccasion: string;

  @Prop({ required: true, enum: ['in-stock', 'sold-out'], default: 'in-stock' })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
