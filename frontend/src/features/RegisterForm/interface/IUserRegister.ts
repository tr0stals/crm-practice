export interface IUserRegister {
  email: string;
  userName: string;
  password: string;
  passwordSalt: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  comment?: string;
}
