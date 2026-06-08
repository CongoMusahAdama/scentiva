import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  fullName: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Prop()
  profileImage: string; // Will store Cloudinary URL

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  otp?: string;

  @Prop({ required: false })
  otpExpires?: Date;

  @Prop({ type: [String], default: [] })
  wishlist: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
