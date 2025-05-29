import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
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
    try {
      const users = await this.userService.getUsers();
      // Удаляем поле password из каждого пользователя
      return (users ?? []).map(({ password, ...rest }) => rest);
    } catch (e) {
      console.error(e);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
