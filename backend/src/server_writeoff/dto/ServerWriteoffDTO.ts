import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class ServerWriteoffDTO {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  dateTime: Date;

  @IsOptional()
  @IsNotEmpty()
  componentCount: string;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;

  @IsOptional()
  @IsNotEmpty()
  factoryId: number;

  @IsOptional()
  @IsNotEmpty()
  currentTaskId: number;
}
