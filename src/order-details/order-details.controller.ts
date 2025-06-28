/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Roles('Admin', 'Staff', 'User')
  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailsService.create(createOrderDetailDto);
  }

  @Roles('Admin')
  @Get()
  findAll() {
    return this.orderDetailsService.findAll();
  }

  @Roles('Admin', 'Staff', 'User')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailsService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailsService.update(id, updateOrderDetailDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailsService.remove(id);
  }
}
