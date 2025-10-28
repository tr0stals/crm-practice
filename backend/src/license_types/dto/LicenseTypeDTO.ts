import { IsNotEmpty, IsOptional } from 'class-validator';

export class LicenseTypeDTO {
  @IsOptional()
  @IsNotEmpty()
  title: string;
}
