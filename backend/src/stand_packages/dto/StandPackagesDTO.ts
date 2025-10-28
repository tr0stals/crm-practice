import { IsOptional, IsNotEmpty, Min } from 'class-validator';

export class StandPackagesDTO {
  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  width: number;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  height: number;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  thickness: number;

  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  weight: number;

  @IsOptional()
  image: string;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  standId: number;
}
