import { IsNotEmpty, IsOptional } from 'class-validator';

export class CurrentTasksComponentsDTO {
  @IsOptional()
  componentCount: number;

  @IsOptional()
  warehouseComponentCount: number;

  @IsOptional()
  @IsNotEmpty()
  currentTaskId: number;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;
}
