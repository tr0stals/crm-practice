import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { PeoplesService } from 'src/peoples/peoples.service';
import { UserRegisterDTO } from 'src/user/dto/UserRegisterDTO';
import { EmployeesService } from 'src/employees/employees.service';
import { EmployeesProfessionsService } from 'src/employees_professions/employees_professions.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private peopleService: PeoplesService,
    private jwtService: JwtService,
    private employeeService: EmployeesService,
    private employeeProfessionService: EmployeesProfessionsService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByUsername(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(userData: UserRegisterDTO) {
    // Проверяем, если это регистрация супер админа (первый пользователь в системе)
    const existingUsers = await this.userService.getUsers();
    const isSuperAdmin = !existingUsers || existingUsers.length === 0;

    const peopleData = isSuperAdmin ? {
      firstName: "admin",
      middleName: "admin",
      lastName: "admin",
      phone: "+79999999999",
      email: "info@apracticum.ru",
      comment: "Супер администратор системы",
      birthDate: new Date("1999-11-30"),
    } : {
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      middleName: userData.middleName,
      lastName: userData.lastName,
      comment: userData.comment,
      birthDate: userData.birthDate,
    };

    const people = await this.peopleService.create(peopleData);

    const employee = await this.employeeService.create({
      peoples: people,
      peopleId: people.id,
    });

    if (!employee) {
      throw new Error('Employee creation failed');
    }

    /**
     * Здесь не указываем professionId: при регистрации установится дефолт - Администратор
     */
    const employeeProfession =
      await this.employeeProfessionService.assignProfession({
        employeeId: employee.id,
      });

    const user = await this.userService.create({
      ...userData,
      employeeId: employee.id, // Передаем всю сущность Employee
    });

    return {
      user,
      employeeProfession,
    };
  }

  async login(userName: string, password: string) {
    const user = await this.userService.findByUsername(userName);
    console.log(user);

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { userName: user.userName, sub: user.id };

    const fullUser = await this.userService.getUserWithProfessionTitle(user.id);
    return {
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h', // токен действителен 24ч
      }),
      user: fullUser,
    };
  }
}
