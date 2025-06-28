/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Patch, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles('Admin', 'Customer')
  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Roles('Admin', 'Staff', 'User')
  @Patch('edit-profile')
  editProfile(@Body() editProfileDto: EditProfileDto) {
    return this.authService.editProfile(editProfileDto);
  }

  @IsPublic()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResp = await this.authService.login(loginDto);
    res.cookie('auth', authResp.token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
    res.status(200).json(authResp);
  }

  @Roles('Admin', 'Staff', 'User')
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth'); // Or res.cookie('myCookie', '', { expires: new Date(0) });
    res
      .status(200)
      .json({ status: 'success', message: 'Logout is successfully!' });
  }

  @IsPublic()
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
