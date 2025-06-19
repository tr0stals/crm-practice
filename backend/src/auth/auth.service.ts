import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByUsername(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userName: string, password: string) {
    const user = await this.userService.findByUsername(userName);
    console.log(user);

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { userName: user.userName, sub: user.id };
    console.log(payload);
    const fullUser = await this.userService.getUserWithProfessionTitle(user.id);
    return {
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h', // токен действителен 24ч
      }),
      user: fullUser,
    };
  }
}
