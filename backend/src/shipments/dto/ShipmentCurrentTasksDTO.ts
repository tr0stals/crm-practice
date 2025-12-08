import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ShipmentCurrentTasksDTO {
  @IsNotEmpty({ message: 'Данное поле является обязательным' })
  @IsInt({ message: 'Цена должна быть числом' })
  price: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Дата добавления должна быть корректной' })
  addedDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Дата отправки должна быть корректной' })
  shipmentDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Дата прибытия должна быть корректной' })
  arrivalDate: Date;

  @IsOptional()
  @IsNotEmpty({ message: 'Добавьте спецификацию' })
  specificationImage: string[];

  @IsOptional()
  @IsString({ message: 'Комментарий должен быть строкой' })
  @MaxLength(256, { message: 'Длина комментария не может превышать 256' })
  comment?: string;

  @IsOptional()
  licenseId?: number;

  @IsOptional()
  factoryId: number;

  @IsOptional()
  transporterId: number;

  @IsOptional()
  clientId: number;

  @IsOptional()
  standId: number;
}
