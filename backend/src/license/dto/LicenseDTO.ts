import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class LicenseDTO {
  @IsOptional()
  licenseTypeId: number;

  @IsOptional()
  @IsNotEmpty()
  licenseCode: string;

  @IsOptional()
  @Type(() => Date)
  start: Date;

  @IsOptional()
  @Type(() => Date)
  end: Date;

  @IsOptional()
  @Min(0)
  places: number;

  @IsOptional()
  timeout: string;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  standId: number;
}
