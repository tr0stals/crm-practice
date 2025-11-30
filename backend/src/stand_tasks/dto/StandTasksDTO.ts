import { IsNotEmpty, IsOptional } from 'class-validator';

export class StandTasksDTO {
  @IsOptional()
  parentId: number | null;

  @IsOptional()
  @IsNotEmpty()
  order: number;

  @IsOptional()
  componentOutCount?: number;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  photo: string;

  @IsOptional()
  @IsNotEmpty()
  isWriteoffComponents: boolean;

  @IsOptional()
  @IsNotEmpty()
  manufactureTime: number;

  @IsOptional()
  isCompleted: boolean;

  @IsOptional()
  standId: number;

  @IsOptional()
  professionId?: number;

  @IsOptional()
  componentId?: number;
}
