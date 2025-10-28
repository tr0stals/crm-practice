import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class EmployeesVacationsDTO {
  @IsOptional()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  employeeId: number;

  @Type(() => Date)
  factoryId: number;
}
