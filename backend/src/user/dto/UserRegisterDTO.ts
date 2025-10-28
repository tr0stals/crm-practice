import { IsOptional, IsNotEmpty } from 'class-validator';
import { Employees } from 'src/employees/employees.entity';

export class UserRegisterDTO {
  // Данные для user
  @IsOptional()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  passwordSalt?: string;

  @IsOptional()
  @IsNotEmpty()
  employeeId: number;

  // Данные для Peoples
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  middleName?: string;

  @IsOptional()
  comment?: string;

  @IsOptional()
  birthDate?: Date;
}
