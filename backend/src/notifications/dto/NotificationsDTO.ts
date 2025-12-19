import { IsNotEmpty, IsOptional } from 'class-validator';

export class NotificationsDTO {
  @IsOptional()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsNotEmpty()
  type: string;
}
