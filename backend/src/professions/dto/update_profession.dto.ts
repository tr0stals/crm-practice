import { PartialType } from '@nestjs/swagger';
import { CreateProfessionDto } from './create_profession.dto';

export class UpdateProfessionDto extends PartialType(CreateProfessionDto) {} 