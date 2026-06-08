import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WhenToApplyDto {
  @IsString()
  icon: string;

  @IsString()
  label: string;

  @IsString()
  detail: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  actual: number;

  @IsNumber()
  original: number;

  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @IsString()
  tag: string;

  @IsString()
  category: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  image2?: string;

  @IsString()
  desc: string;

  @IsArray()
  @IsString({ each: true })
  pros: string[];

  @IsArray()
  @IsString({ each: true })
  cons: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhenToApplyDto)
  whenToApply: WhenToApplyDto[];

  @IsString()
  perfectOccasion: string;

  @IsString()
  status: string;
}

export class UpdateProductDto extends CreateProductDto {}
