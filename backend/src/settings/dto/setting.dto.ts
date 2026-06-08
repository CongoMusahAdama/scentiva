import { IsNotEmpty, IsString } from 'class-validator';

export class SettingDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  tagline: string;

  @IsString()
  email: string;

  @IsString()
  whatsapp: string;

  @IsString()
  socialHandle: string;

  @IsString()
  address: string;

  @IsString()
  currency: string;

  @IsString()
  deliveryNote: string;

  @IsString()
  referralReward: string;
}
