import { IsNotEmpty, IsOptional } from 'class-validator';

export class OrderRequestsComponentsDTO {
  @IsOptional()
  @IsNotEmpty()
  componentCount: number;

  @IsOptional()
  link: string;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  orderRequestId: number;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;

  @IsOptional()
  @IsNotEmpty()
  supplierId: number;
}
