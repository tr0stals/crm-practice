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
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  middleName?: string;

  @IsOptional()
  comment?: string;

  @IsOptional()
  birthDate?: Date;
}
