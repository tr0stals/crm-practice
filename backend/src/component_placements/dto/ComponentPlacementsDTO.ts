import { IsNotEmpty, IsOptional } from 'class-validator';

export class ComponentPlacementsDTO {
  @IsOptional()
  building: string;

  @IsOptional()
  room: string;

  @IsOptional()
  @IsNotEmpty()
  placementTypeId: number;
}
