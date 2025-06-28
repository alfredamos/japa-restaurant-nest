/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Roles('Admin')
  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Roles('Admin', 'Staff', 'User')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(id);
  }

  @Roles('Admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto);
  }

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemsService.remove(id);
  }
}
