import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { UserRegisterDTO } from 'src/user/dto/UserRegisterDTO';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() user: UserRegisterDTO) {
    const newUser = await this.userService.create({ ...user });
    return { id: newUser?.id, email: newUser?.email };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check')
  async check(@Request() req) {
    return { user: req.user };
  }
}
