import { IsNotEmpty, IsOptional } from 'class-validator';

export class PCBSDTO {
  @IsOptional()
  parentId?: number;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;

  @IsOptional()
  @IsNotEmpty()
  standId: number;
}
