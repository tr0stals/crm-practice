import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class InventarizationDTO {
  @IsOptional()
  @Type(() => Date)
  @IsNotEmpty()
  inventarizationDate: Date;

  @IsOptional()
  @IsNotEmpty()
  componentCount: number;

  @IsOptional()
  inventarizationQuality: number;

  @IsOptional()
  componentId: number;

  @IsOptional()
  factoryId: number;
}
