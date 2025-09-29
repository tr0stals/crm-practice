import { OrganizationTypes } from 'src/organization_types/organization_types.entity';
import { Peoples } from 'src/peoples/peoples.entity';

export class OrganizationsDTO {
  parentId: number;
  fullName: string;
  shortName: string;
  lawAddress: string;
  factAddress: string;
  postAddress: string;
  inn: string;
  kpp: string;
  orgn: string;
  orgnDate: Date;
  phone: string;
  email: string;
  digitalDocs: boolean;
  rating: number;
  comment: string;
  contactPeopleId: number;
  organizationTypeId: number;
}
