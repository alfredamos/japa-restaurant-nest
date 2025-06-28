/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;
  @IsNotEmpty()
  @IsString()
  category: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNotEmpty()
  @IsString()
  specialTag: string;
  @IsNotEmpty()
  @IsString()
  image: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  userId: string;
}
