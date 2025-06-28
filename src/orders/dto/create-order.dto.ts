/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Status } from "@prisma/client";
import { IsOptional, IsNotEmpty, IsString, IsEnum } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateOrderDto {
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
