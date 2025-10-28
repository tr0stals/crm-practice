import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class ShipmentTripsDTO {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  tripStartDate: Date;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  tripEndDate: Date;

  @IsOptional()
  @IsNotEmpty()
  shipmentId: number;

  @IsOptional()
  @IsNotEmpty()
  employeeId: number;
}
