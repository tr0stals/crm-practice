import { IsOptional } from 'class-validator';

export class EmployeesDepartmentsDTO {
  @IsOptional()
  employeeId: number;

  @IsOptional()
  departmentId: number;
}
