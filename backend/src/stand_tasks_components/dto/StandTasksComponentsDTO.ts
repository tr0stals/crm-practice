import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class StandTasksComponentsDTO {
  @IsOptional()
  @Min(0)
  componentCount?: number;

  @IsOptional()
  @IsNotEmpty()
  standTaskId: number;

  @IsOptional()
  componentId?: number;
}
