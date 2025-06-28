/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional } from "class-validator";

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  image: string;
  @IsNotEmpty()
  @IsString()
  menuItemId: string;
  @IsOptional()
  orderId: string;
}
