import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class StandTasksComponentsDTO {
  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  componentCount: number;

  @IsOptional()
  @IsNotEmpty()
  standTaskId: number;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;
}
