/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SameUserGuard } from 'src/guards/same-user.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, SameUserGuard],
})
export class UsersModule {}
