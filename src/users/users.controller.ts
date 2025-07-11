/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decorator';
import { SameUserGuard } from 'src/guards/same-user.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles('Admin', 'User', 'Staff')
  @UseGuards(SameUserGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles('Admin', 'User', 'Staff')
  @UseGuards(SameUserGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
