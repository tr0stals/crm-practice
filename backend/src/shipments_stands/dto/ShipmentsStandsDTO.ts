import { IsOptional, IsNotEmpty } from 'class-validator';

export class ShipmentsStandsDTO {
  @IsOptional()
  @IsNotEmpty()
  shipmentId: number;

  @IsOptional()
  @IsNotEmpty()
  standId: number;
}
