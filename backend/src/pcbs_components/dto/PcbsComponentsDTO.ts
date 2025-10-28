import { IsNotEmpty, IsOptional } from 'class-validator';

export class PcbsComponentsDTO {
  @IsOptional()
  @IsNotEmpty()
  componentCount: number;

  @IsOptional()
  @IsNotEmpty()
  pcbId: number;

  @IsOptional()
  @IsNotEmpty()
  componentId: number;
}
