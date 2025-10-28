import { IsNotEmpty, IsOptional } from 'class-validator';

export class PeoplesDTO {
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
