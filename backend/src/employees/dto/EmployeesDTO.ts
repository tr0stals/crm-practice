import { Peoples } from 'src/peoples/peoples.entity';

export class EmployeesDTO {
  hiringDate?: Date;
  dismissalDate?: Date;
  peoples?: Peoples;
  peopleId?: number;
}
