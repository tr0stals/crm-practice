import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class PeoplesDTO {
  @IsOptional()
  email?: string;

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
