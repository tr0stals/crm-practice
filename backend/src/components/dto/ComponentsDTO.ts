import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { EmptyToNullNumber } from 'src/utils/emptyToNullNumber';

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
  @EmptyToNullNumber()
  width: number;

  @IsOptional()
  @Min(0)
  @EmptyToNullNumber()
  height: number;

  @IsOptional()
  @Min(0)
  @EmptyToNullNumber()
  thickness: number;

  @IsOptional()
  @Min(0)
  @EmptyToNullNumber()
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
