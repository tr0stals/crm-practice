import { IsNotEmpty, IsOptional } from 'class-validator';

export class BillsComponentsDTO {
  @IsOptional()
  @IsNotEmpty()
  componentCount: number;

  @IsOptional()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNotEmpty()
  link: string;

  @IsOptional()
  @IsNotEmpty()
  billId: number;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;
}
