import { Employees } from 'src/employees/employees.entity';

export class UserRegisterDTO {
  // Данные для user
  userName: string;
  password: string;
  passwordSalt?: string;
  employeeId: number;

  // Данные для Peoples
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  comment?: string;
}
