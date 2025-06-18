export class UserRegisterDTO {
  // Данные для user
  userName: string;
  password: string;
  passwordSalt?: string;
  peopleId: number;
  professionId: number;

  // Данные для Peoples
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  comment?: string;
}
