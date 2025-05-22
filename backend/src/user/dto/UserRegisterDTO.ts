export class UserRegisterDTO {
  email: string;
  userName: string;
  password: string;
  passwordSalt: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  comment?: string;
  state: string;
}
