/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsController } from './menu-items.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MenuItemsController],
  providers: [MenuItemsService, PrismaService],
})
export class MenuItemsModule {}
