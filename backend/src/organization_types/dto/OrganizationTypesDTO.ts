import { IsNotEmpty, IsOptional } from 'class-validator';

export class OrganizationTypesDTO {
  @IsOptional()
  icon?: string;

  @IsOptional()
  @IsNotEmpty()
  title: string;
}
