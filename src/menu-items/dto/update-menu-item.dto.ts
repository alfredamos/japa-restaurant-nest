/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
