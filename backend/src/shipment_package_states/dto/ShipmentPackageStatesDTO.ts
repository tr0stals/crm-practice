import { IsOptional, IsNotEmpty } from 'class-validator';

export class ShipmentPackageStatesDTO {
  @IsOptional()
  @IsNotEmpty()
  title: string;
}
