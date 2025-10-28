import { IsNotEmpty, IsOptional } from 'class-validator';

export class BillsComponentsDTO {
  @IsOptional()
  @IsNotEmpty()
  componentCount: number;

  @IsOptional()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  link: string;

  @IsOptional()
  billId: number;

  @IsOptional()
  componentId: number;
}
