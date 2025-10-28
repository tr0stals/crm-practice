import { IsNotEmpty, IsOptional } from 'class-validator';

export class InvoicesComponentsDTO {
  @IsOptional()
  @IsNotEmpty()
  componentCount: number;

  @IsOptional()
  arrivalInvoiceId: number;

  @IsOptional()
  componentId: number;
}
