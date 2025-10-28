import { IsOptional, IsNotEmpty } from 'class-validator';

export class ShipmentPackageDTO {
  @IsOptional()
  @IsNotEmpty()
  photo: string;

  @IsOptional()
  @IsNotEmpty()
  width: string;

  @IsOptional()
  @IsNotEmpty()
  height: string;

  @IsOptional()
  @IsNotEmpty()
  thickness: string;

  @IsOptional()
  @IsNotEmpty()
  weight: string;

  @IsOptional()
  @IsNotEmpty()
  stateId: number;

  @IsOptional()
  @IsNotEmpty()
  shipmentId: number;
}
