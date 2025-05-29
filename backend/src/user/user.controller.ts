import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDTO } from './dto/UserRegisterDTO';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() user: UserRegisterDTO) {
    // Здесь позже добавим хеширование пароля!
    return this.userService.create(user);
  }

  @Get('get')
  async getUsers() {
    return this.userService.getUsers();
  }
}
