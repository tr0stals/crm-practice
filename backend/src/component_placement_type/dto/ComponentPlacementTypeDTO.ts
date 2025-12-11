import { IsNotEmpty, IsOptional } from 'class-validator';

export class ComponentPlacementTypeDTO {
  @IsOptional()
  @IsNotEmpty()
  title: string;
}
