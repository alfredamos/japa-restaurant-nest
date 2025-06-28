/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UuidTool } from 'uuid-tool';
import { Role } from '@prisma/client';
import { UserInfo } from 'src/models/auth/userInfoModel';

@Injectable()
export class SameUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getClass(),
      context.getHandler(),
    ]);

    //----> Public resources.
    if (isPublic) return true;

    //----> Get the request object.
    const request = context.switchToHttp().getRequest();

    //----> Get the user id from params.
    const { id: userIdFromParam } = request.params;

    //----> Get the user from the request object.
    const user = request.user as UserInfo;

    //----> Get the user-id from auth-user.
    const userIdFromAuth = user?.id;

    //----> Check for the equality of user id from order request and the one from auth payload.
    const isSameUser = UuidTool.compare(
      userIdFromAuth,
      userIdFromParam as string,
    );

    //----> Check for admin privilege.
    const isAdmin = user?.role === Role.Admin;

    console.log('same-user-guard, userIdFromAuth : ', userIdFromAuth);
    console.log('same-user-guard, userIdFromParam : ', userIdFromParam);
    console.log('same-user-guard, isSameUser : ', isSameUser);
    console.log('same-user-guard, isAdmin : ', isAdmin);

    //----> Non admin non same user cannot pass.
    if (!isSameUser && !isAdmin) {
      throw new UnauthorizedException(
        'You are not permitted to access this page!',
      );
    }

    //----> Admin and same user are allowed to pass.
    return true;
  }
}
