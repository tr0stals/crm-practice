import { Controller, Post, Body } from '@nestjs/common';
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
}
