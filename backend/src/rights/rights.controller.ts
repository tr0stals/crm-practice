import { Controller } from '@nestjs/common';
import { RightsService } from './rights.service';

@Controller('rights')
export class RightsController {
  constructor(private readonly rightsService: RightsService) {}
}
