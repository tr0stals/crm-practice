import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDTO } from './dto/UserRegisterDTO';

@Controller('user')
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
      // Удаляем поле password и passwordSalt из каждого пользователя
      return (users ?? []).map(({ password, passwordSalt, ...rest }) => rest);
    } catch (e) {
      console.error(e);
    }
  }

  @Get('get/:id')
  async getUserById(@Param('id') id: number) {
    return await this.userService.getUserWithProfessionTitle(id);
  }

  @Get('generateData')
  async generateData() {
    return await this.userService.generateData();
  }

  @Patch('update/:id')
  async update(@Param('id') id, @Body() updateUser: UserRegisterDTO) {
    return await this.userService.update(id, updateUser);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
