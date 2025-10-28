import { IsOptional } from 'class-validator';

export class EmployeesProfessionsDTO {
  @IsOptional()
  employeeId: number;

  @IsOptional()
  professionId: number;
}
