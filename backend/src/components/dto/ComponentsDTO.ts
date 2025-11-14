import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class ComponentsDTO {
  @IsOptional()
  parentId: number;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  photo: string;

  @IsOptional()
  @Min(0)
  width: number;

  @IsOptional()
  @Min(0)
  height: number;

  @IsOptional()
  @Min(0)
  thickness: number;

  @IsOptional()
  @Min(0)
  weight: number;

  @IsOptional()
  material: string;

  @IsOptional()
  @Type(() => Date)
  receiptDate: Date;

  @IsOptional()
  drawingReference: string;

  @IsOptional()
  placementId?: number;
}
