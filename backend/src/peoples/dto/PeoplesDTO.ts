import { IsNotEmpty } from 'class-validator';

export class PeoplesDTO {
  @IsNotEmpty()
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  comment?: string;
  birthDate?: Date;
}
