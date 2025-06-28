/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { OrderDetail } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderDetailsService {
  constructor(private prisma: PrismaService) {}
    
    async create(createOrderDetailDto: CreateOrderDetailDto) {
      //----> Insert the menu-item in the database.
      const newOrderDetail = await this.prisma.orderDetail.create({ data: createOrderDetailDto });
  
      //----> Check for error.
      if (!newOrderDetail) {
        throw new BadRequestException('OrderDetail not created');
      }
  
      //----> Send back the newly created menu-item. 
      return newOrderDetail;
    }
  
    async findAll(): Promise<OrderDetail[]> {
      //----> Retrieve all orderDetails.
      const allOrderDetails = await this.prisma.orderDetail.findMany({});
      //----> Send back the response.
      return allOrderDetails;
    }
  
    async findOne(id: string): Promise<OrderDetail> {
      //----> Retrieve the orderDetail with the given id.
      const orderDetail = await this.prisma.orderDetail.findUnique({ where: { id } });
      //----> Check for the existence of orderDetail with the given id.
      if (!orderDetail) {
        throw new NotFoundException(`The orderDetail with id : ${id} is not found!`);
      }
      //----> Send back the response.
      return orderDetail;
    }
  
    async remove(id: string): Promise<OrderDetail> {
      //----> Check for the existence of orderDetail with the given id.
      await this.prisma.orderDetail.delete({ where: { id } });
  
      //----> Delete the orderDetail with the given id.
      const deletedOrderDetail = await this.prisma.orderDetail.delete({ where: { id } });
      //----> Send back the response.
      return deletedOrderDetail;
    }
  
    async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto) {
      //----> Check for existence of menu-item.
      await this.findOne(id);
  
      //----> Updated the menu-item in the database.
      const editedOrderDetail = await this.prisma.orderDetail.update({
        data: updateOrderDetailDto,
        where: { id },
      });
  
      //----> Check for error.
      if (!editedOrderDetail) {
        throw new NotFoundException(`OrderDetail with id: ${id} cannot be updated`);
      }
  
      //----> Send back the result.
      return editedOrderDetail;
    }
}
