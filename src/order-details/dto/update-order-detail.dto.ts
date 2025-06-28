/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
