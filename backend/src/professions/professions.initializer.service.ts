import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProfessionsService } from './professions.service';
import { DEFAULT_PROFESSIONS } from './constants/default_professions';
import { Professions } from './professions.entity';

@Injectable()
export class ProfessionsInitializerService implements OnModuleInit {
  private readonly logger = new Logger(ProfessionsInitializerService.name);

  constructor(private readonly professionsService: ProfessionsService) {}

  async onModuleInit() {
    await this.initializeDefaultProfessions();
  }

  private async initializeDefaultProfessions() {
    try {
      this.logger.log('Начало инициализации стандартных профессий...');

      const existingProfessions = await this.professionsService.getAll();
      const existingTitles = new Set(existingProfessions.map(p => p.title));

      const newProfessions = DEFAULT_PROFESSIONS.filter(
        title => !existingTitles.has(title)
      );

      if (newProfessions.length === 0) {
        this.logger.log('Все стандартные профессии уже существуют');
        return;
      }

      for (const title of newProfessions) {
        try {
          const profession = new Professions();
          profession.title = title;
          await this.professionsService.create(profession);
          this.logger.log(`Добавлена профессия: ${title}`);
        } catch (error) {
          this.logger.error(`Ошибка при добавлении профессии ${title}: ${error.message}`);
        }
      }

      this.logger.log(`Инициализация завершена. Добавлено ${newProfessions.length} новых профессий`);
    } catch (error) {
      this.logger.error(`Ошибка при инициализации профессий: ${error.message}`);
    }
  }
} 