import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rights } from './rights.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RightsService {
  constructor(@InjectRepository(Rights) repo: Repository<Rights>) {}
}
