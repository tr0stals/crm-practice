import { Peoples } from 'src/peoples/peoples.entity';

export class UpdateEmployeeUnitDTO {
  hiringDate: Date;
  dismissalDate?: Date;
  peoples: Peoples;
  departmentId: number;
  professionId: number;
}
