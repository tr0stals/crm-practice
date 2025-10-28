import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { OrganizationTypes } from 'src/organization_types/organization_types.entity';
import { Peoples } from 'src/peoples/peoples.entity';

export class OrganizationsDTO {
  @IsOptional()
  parentId: number;

  @IsOptional()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsNotEmpty()
  shortName: string;

  @IsOptional()
  @IsNotEmpty()
  lawAddress: string;

  @IsOptional()
  @IsNotEmpty()
  factAddress: string;

  @IsOptional()
  @IsNotEmpty()
  postAddress: string;

  @IsOptional()
  @IsNotEmpty()
  inn: string;

  @IsOptional()
  @IsNotEmpty()
  kpp: string;

  @IsOptional()
  @IsNotEmpty()
  orgn: string;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  orgnDate: Date;

  @IsOptional()
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  digitalDocs: boolean;

  @IsOptional()
  @IsNotEmpty()
  rating: number;

  @IsOptional()
  comment: string;

  @IsOptional()
  @IsNotEmpty()
  contactPeopleId: number;

  @IsOptional()
  @IsNotEmpty()
  organizationTypeId: number;
}
