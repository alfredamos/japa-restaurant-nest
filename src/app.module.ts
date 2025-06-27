import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PrismaModule, MenuItemsModule, OrdersModule, OrderDetailsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
