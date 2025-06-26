import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { PeoplesModule } from 'src/peoples/peoples.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { EmployeesProfessionsModule } from 'src/employees-professions/employees-professions.module';

@Module({
  imports: [
    UserModule,
    PeoplesModule,
    EmployeesModule,
    EmployeesProfessionsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key', // В продакшене использовать переменные окружения
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
