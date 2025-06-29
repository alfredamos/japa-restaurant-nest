/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDetail } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { OrderPayload } from 'src/models/orders/orderPayload.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderPayloadDto } from './dto/order-payload.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService){}
  async createOrder(orderPayLoad: OrderPayloadDto) {
    //----> Calculate the totalQuantity, totalPrice and make order paymentId.
    const ordPayload = this.getTotalQuantityAndTotalPrice(orderPayLoad);

    //----> Destructure ordPayload.
    const { orderDetails, ...rest } = ordPayload;

    //----> Store the new order info in the database.
    const createdOrder = await this.prisma.order.create({
      data: {
        ...rest,
        orderDetails: {
          create: orderDetails?.map((cart) => ({
            ...cart,
            pizza: {
              create: {
                id: cart.menuItemId,
              },
            },
          })),
        },
      },
      include: {
        orderDetails: true,
      },
    });

    return createdOrder;
  }

  async orderCreate(orderPayload: OrderPayloadDto) {
    //----> Calculate the totalQuantity, totalPrice and make order paymentId.
    const ordPayload = this.getTotalQuantityAndTotalPrice(orderPayload);

    //----> Destructure ordPayload.
    const { orderDetails, ...rest } = ordPayload;

    //----> Insert the order in the database.
    const createdOrder = await this.prisma.order.create({
      data: {
        ...rest,
      },
    });

    //----> Insert the order-details in the database.
    const newOrderDetails = await this.createBatchOrderDetails(
      orderDetails,
      createdOrder?.id,
    );

    //----> Send back the results.
    return { createdOrder, orderDetails: newOrderDetails };
  }

  async deleteAllOrders() {
    //----> Delete all order-details.
    await this.prisma.orderDetail.deleteMany({});

    //----> Delete all orders.
    const numberOfOrders = (await this.prisma.order.deleteMany({})).count;

    //----> Check for existence of orders.
    if (!numberOfOrders) {
      throw new NotFoundException('Orders are not available for deletion!');
    }

    //----> Send back the response.
    return {
      status: 'success',
      message: 'All orders are deleted successfully!',
    };
  }

  async deleteOrderById(id: string) {
    //----> Delete all associated cart-items.
    await this.prisma.order.update({
      where: { id },
      data: {
        orderDetails: {
          deleteMany: {},
        },
      },
      include: {
        orderDetails: true,
      },
    });

    //----> Delete the order info from the database.
    const deletedOrder = await this.prisma.order.delete({ where: { id } });

    return deletedOrder;
  }

  async deleteOrdersByUserId(userId: string) {
    //----> Get the customer with the user-id.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    //----> Get all the orders by customerId.
    const orders = await this.prisma.order.findMany({
      where: { userId: user?.id },
    });

    //----> Check for existence of orders.
    if (!orders.length){
      throw new NotFoundException("Orders are not available for this user!")
    }

    //----> Delete all these others in the database.
    this.allOrdersDeletedByUserId(orders, user?.id);

    //----> Send back the response.
    return {
      status: 'success',
      message: 'All orders are deleted successfully!',
    };
  }

  async editOrderById(id: string, orderToEdit: UpdateOrderDto) {
    //----> Store the edited order info in the database.
    const editedOrder = await this.prisma.order.update({
      where: { id },
      data: { ...orderToEdit },
    });

    return editedOrder;
  }

  async getAllOrders() {
    //----> Get all the orders from the database.
    const allOrders = await this.prisma.order.findMany({
      include: { orderDetails: true, user: true },
    });

    //----> Check for existence of orders.
    if (!allOrders.length) {
      throw new NotFoundException('Orders are not available!');
    }

    return allOrders;
  }

  async getAllOrdersByUserId(userId: string) {
    //----> Get all the orders from the database.
    const allOrders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderDetails: true,
        user: true,
      },
    });

    //----> Check for existence of orders.
    if (!allOrders.length) {
      throw new NotFoundException('Orders are not available for this user!');
    }

    return allOrders;
  }

  async getOneOrder(id: string) {
    //----> Get the order in the db.
    const order = await this.getOrderById(id, true);

    return order;
  }

  private async getOrderById(id: string, include: boolean = false) {
    //----> Retrieve the order info with this id from database.
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderDetails: include,
      },
    });

    //---->Check for existence.
    if (!order) {
      throw new NotFoundException(`Order with id : ${id}!`);
    }

    //----> Send back a valid order.
    return order;
  }

  private async createBatchOrderDetails(
    orderDetails: OrderDetail[],
    orderId: string,
  ) {
    //----> Include the order-id in the order-details.
    const ordDetails = orderDetails.map((ordDet: OrderDetail) => ({
      ...ordDet,
      orderId,
    }));

    //----> Insert all the order-details in the database.
    return await this.prisma.orderDetail.createMany({
      data: [...ordDetails],
      skipDuplicates: false,
    });
  }

  private getTotalQuantityAndTotalPrice(orderPayload: OrderPayload) {
    const paymentId = uuidv4(); //----> Generate paymentId

    const ordPayload = { ...orderPayload }; //----> Order payload temp.
    ordPayload.paymentId = paymentId;

    //----> Calculate totalQuantity.
    const totalQuantity = orderPayload?.orderDetails?.reduce(
      (accum, current) => accum + current.quantity,
      0,
    );

    //----> Calculate totalQuantity and price.
    const totalPrice = orderPayload?.orderDetails?.reduce(
      (accum, current) => accum + current.quantity * current.price,
      0,
    );

    //----> Total price.
    ordPayload.totalPrice = totalPrice;

    //----> Total quantity.
    ordPayload.totalQuantity = totalQuantity;

    //----> Order date.
    ordPayload.orderDate = new Date();
    //----> Send back the result.
    return ordPayload;
  }

  private allOrdersDeletedByUserId(orders: Order[], userId: string) {
    //----> Delete all orders by customerId
    const userOrders = orders?.filter((order) => order.userId === userId);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    userOrders?.forEach(async (order) => {
      //----> Delete all associated cart-items.
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          orderDetails: {
            deleteMany: {},
          },
        },
        include: {
          orderDetails: true,
        },
      });
      //----> Delete the order info from the database.
      await this.prisma.order.delete({ where: { id: order.id } });
    });
  }
}
