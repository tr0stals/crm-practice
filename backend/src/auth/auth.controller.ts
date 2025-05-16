import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';

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
  async register(@Body() body: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.userService.create({
      email: body.email,
      password: hashedPassword,
    });
    return { id: user.id, email: user.email };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check')
  async check(@Request() req) {
    return { user: req.user };
  }
} 