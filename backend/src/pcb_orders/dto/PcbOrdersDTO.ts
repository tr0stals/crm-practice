import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class PcbOrdersDTO {
  @IsOptional()
  @Type(() => Date)
  @IsNotEmpty()
  orderDate: Date;

  @IsOptional()
  @IsNotEmpty()
  billNumber: string;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  count: number;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  width: number;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  height: number;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  thickness: number;

  @IsOptional()
  @IsNotEmpty()
  article: string;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNotEmpty()
  pcbId: number;

  @IsOptional()
  @IsNotEmpty()
  pcbManufacturerId: number;

  @IsOptional()
  @IsNotEmpty()
  factoryId: number;

  @IsOptional()
  @IsNotEmpty()
  employeeId: number;

  @IsOptional()
  @IsNotEmpty()
  pcbOrderStatusId: number;
}
