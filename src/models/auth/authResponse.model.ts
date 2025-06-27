/* eslint-disable prettier/prettier */
import { User } from "@prisma/client";

export class AuthResponseModel { 
  user!: User;
  isLoggedIn: boolean = false;
  token?: string = "";
  isAdmin?: boolean
}