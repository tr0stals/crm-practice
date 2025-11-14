import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ArrivalInvoicesDTO {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsNotEmpty()
  numberInvoice: string;

  @IsOptional()
  scanPhoto: string;

  @IsOptional()
  dateTimeToWarehouse: Date;

  @IsOptional()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNotEmpty()
  vat: boolean;

  @IsOptional()
  @IsNotEmpty()
  supplierId: number;

  @IsOptional()
  @IsNotEmpty()
  factoryId: number;
}
