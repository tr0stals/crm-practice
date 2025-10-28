import { IsOptional } from 'class-validator';
import { Peoples } from 'src/peoples/peoples.entity';

export class EmployeesDTO {
  @IsOptional()
  dismissalDate?: Date;

  @IsOptional()
  peoples?: Peoples;

  @IsOptional()
  peopleId?: number;
}
