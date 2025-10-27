import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LicenseDTO {
  @IsOptional()
  licenseTypeId: number;

  @IsOptional()
  @IsNotEmpty()
  licenseCode: string;

  @IsOptional()
  @Type(() => Date)
  @IsNotEmpty()
  start: Date;

  @IsOptional()
  @Type(() => Date)
  @IsNotEmpty()
  end: Date;

  @IsOptional()
  @IsNotEmpty()
  places: number;

  @IsOptional()
  @IsNotEmpty()
  timeout: string;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  standId: number;
}
