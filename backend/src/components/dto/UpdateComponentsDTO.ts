import { PartialType } from '@nestjs/mapped-types';
import { ComponentsDTO } from './ComponentsDTO';

export class UpdateComponentsDTO extends PartialType(ComponentsDTO) {}
