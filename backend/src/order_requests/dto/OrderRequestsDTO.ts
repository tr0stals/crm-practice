import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class OrderRequestsDTO {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @Type(() => Date)
  requestDatetime: Date;

  @IsOptional()
  @Type(() => Date)
  executionDatetime: Date;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  factoryId: number;

  @IsOptional()
  @IsNotEmpty()
  standId: number;

  @IsOptional()
  @IsNotEmpty()
  employeeCreatorId: number;
}
