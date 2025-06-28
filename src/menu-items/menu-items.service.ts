/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenuItem } from '@prisma/client';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}
  
  async create(createMenuItemDto: CreateMenuItemDto) {
    //----> Insert the menu-item in the database.
    const newMenuItem = await this.prisma.menuItem.create({ data: createMenuItemDto });

    //----> Check for error.
    if (!newMenuItem) {
      throw new BadRequestException('MenuItem not created');
    }

    //----> Send back the newly created menu-item. 
    return newMenuItem;
  }

  async findAll(): Promise<MenuItem[]> {
    //----> Retrieve all menuItems.
    const allMenuItems = await this.prisma.menuItem.findMany({});
    //----> Send back the response.
    return allMenuItems;
  }

  async findOne(id: string): Promise<MenuItem> {
    //----> Retrieve the menuItem with the given id.
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    //----> Check for the existence of menuItem with the given id.
    if (!menuItem) {
      throw new NotFoundException(`The menuItem with id : ${id} is not found!`);
    }
    //----> Send back the response.
    return menuItem;
  }

  async remove(id: string): Promise<MenuItem> {
    //----> Check for the existence of menuItem with the given id.
    await this.prisma.menuItem.delete({ where: { id } });

    //----> Delete the menuItem with the given id.
    const deletedMenuItem = await this.prisma.menuItem.delete({ where: { id } });
    //----> Send back the response.
    return deletedMenuItem;
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    //----> Check for existence of menu-item.
    await this.findOne(id);

    //----> Updated the menu-item in the database.
    const editedMenuItem = await this.prisma.menuItem.update({
      data: updateMenuItemDto,
      where: { id },
    });

    //----> Check for error.
    if (!editedMenuItem) {
      throw new NotFoundException(`MenuItem with id: ${id} cannot be updated`);
    }

    //----> Send back the result.
    return editedMenuItem;
  }
}
