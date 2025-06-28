/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CanModifyGuard } from 'src/guards/can-modify.guard';
import { OrderPayloadDto } from './dto/order-payload.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { SameUserGuard } from 'src/guards/same-user.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('Admin')
  @Post()
  createOrder(@Body() createOrderDto: OrderPayloadDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Roles('Admin')
  @Patch('/checkout')
  orderCreate(@Body() createOrderDto: OrderPayloadDto) {
    return this.ordersService.orderCreate(createOrderDto);
  }

  @Roles('Admin')
  @Delete('delete-all-orders')
  deleteAllOrders() {
    return this.ordersService.deleteAllOrders();
  }

  @Roles('Admin', 'Staff', 'User')
  @UseGuards(CanModifyGuard)
  @Delete(':id')
  deleteOrderById(@Param('id') id: string) {
    return this.ordersService.deleteOrderById(id);
  }

  @Roles('Admin', 'Staff', 'User')
  @UseGuards(SameUserGuard)
  @Delete('delete-all-orders-by-user-id/:id')
  deleteOrdersByUserId(@Param('id') id: string) {
    return this.ordersService.deleteOrdersByUserId(id);
  }

  @Roles('Admin', 'Staff', 'User')
  @UseGuards(CanModifyGuard)
  @Patch(':id')
  editOrderId(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.editOrderById(id, updateOrderDto);
  }

  @Roles('Admin')
  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Roles('Admin', 'Staff', 'User')
  @UseGuards(CanModifyGuard)
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOneOrder(id);
  }

  @Roles('Admin', 'Staff', 'User')
  @UseGuards(SameUserGuard)
  @Get('orders-by-user-id/:id')
  getAllOrdersByUserId(@Param('id') id: string) {
    return this.ordersService.getAllOrdersByUserId(id);
  }
}
