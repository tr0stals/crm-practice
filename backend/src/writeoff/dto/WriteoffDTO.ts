import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty, MIN, Min } from 'class-validator';

export class WriteoffDTO {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  datetime: Date;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  count: number;

  @IsOptional()
  comment?: string;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;

  @IsOptional()
  @IsNotEmpty()
  factoryId: number;

  @IsOptional()
  @IsNotEmpty()
  writeoffReasonId: number;
}
