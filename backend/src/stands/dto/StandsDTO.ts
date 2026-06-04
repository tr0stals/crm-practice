import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class StandsDTO {
  @IsOptional()
  parentId?: number;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  width: string;

  @IsOptional()
  height: string;

  @IsOptional()
  thickness: string;

  @IsOptional()
  @Min(0)
  weightNetto: number;

  @IsOptional()
  @Min(0)
  weightBrutto: number;

  @IsOptional()
  link: string;

  @IsOptional()
  vendorCode: string;

  @IsOptional()
  manufactureTime: number;

  @IsOptional()
  comment?: string;

  @IsOptional()
  standTypeId: number;

  @IsOptional()
  employeeId: number;
}
