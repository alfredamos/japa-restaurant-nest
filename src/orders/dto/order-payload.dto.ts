/* eslint-disable prettier/prettier */
import { OrderDetail, Status } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class OrderPayloadDto {
  @IsOptional()
  id: string;
  @IsArray()
  orderDetails: OrderDetail[];
  @IsOptional()
  paymentId: string;
  @IsNotEmpty()
  @IsString()
  userId: string;
  @IsOptional()
  totalPrice: number;
  @IsOptional()
  totalQuantity: number;
  @IsOptional()
  orderDate: Date;
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
