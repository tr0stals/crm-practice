import { IsOptional } from 'class-validator';

export class AssignProfessionDTO {
  @IsOptional()
  employeeId: number;

  @IsOptional()
  professionId?: number;
}
