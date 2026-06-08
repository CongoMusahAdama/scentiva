import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  orders: number;

  @IsString()
  referralCode: string;

  @IsString()
  joined: string;

  @IsString()
  totalSpent: string;
}
