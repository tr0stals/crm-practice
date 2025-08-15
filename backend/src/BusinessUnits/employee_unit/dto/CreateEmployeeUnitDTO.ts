import { EmployeeDepartments } from 'src/employee_departments/employee_departments.entity';
import { EmployeesProfessions } from 'src/employees_professions/employees_professions.entity';
import { Peoples } from 'src/peoples/peoples.entity';

export class CreateEmployeeUnitDTO {
  hiringDate: Date;
  dismissalDate?: Date;
  peoples: number;
  departments: number;
  professions: number;
}
