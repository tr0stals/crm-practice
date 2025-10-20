import { IsArray, IsDate, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class InventarizationCalculationDTO {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  componentIds?: number[];

  @IsNumber()
  @IsPositive()
  factoryId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  calculationDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quality?: number;
}

export class CreateInventarizationFromCalculationDTO {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  componentIds?: number[];

  @IsNumber()
  @IsPositive()
  factoryId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  calculationDate?: Date;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quality: number;
}