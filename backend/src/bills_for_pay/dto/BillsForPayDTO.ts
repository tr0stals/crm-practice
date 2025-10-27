import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Organizations } from 'src/organizations/organizations.entity';

export class BillsForPayDTO {
  @IsOptional()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsNotEmpty()
  numberBill: string;

  @IsOptional()
  scanPhoto: string;

  @IsOptional()
  expectedSupplyDate: Date;

  @IsOptional()
  @IsNotEmpty()
  totalAmount: number;

  @IsOptional()
  vat: boolean;

  @IsOptional()
  link: string;

  @IsOptional()
  supplierId: number;

  @IsOptional()
  factoryId: number;
}
