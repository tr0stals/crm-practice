import { IsNotEmpty, IsOptional } from 'class-validator';

export class PCBSDTO {
  @IsOptional()
  parentId?: number;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  standId: number;
}
