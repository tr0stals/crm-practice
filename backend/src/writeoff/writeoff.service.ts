import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Writeoff } from './writeoff.entity';
import { WriteoffDTO } from './dto/WriteoffDTO';
import { ComponentsService } from 'src/components/components.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { Components } from 'src/components/components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { WriteoffReasons } from 'src/writeoff_reasons/writeoff_reasons.entity';
import { WriteoffReasonsService } from 'src/writeoff_reasons/writeoff_reasons.service';
import { ComponentQuantityWatcherService } from 'src/features/component-quantity-watcher/component-quantity-watcher.service';

@Injectable()
export class WriteoffService {
  constructor(
    @InjectRepository(Writeoff)
    private readonly repo: Repository<Writeoff>,
    @InjectRepository(Components)
    private readonly componentsRepository: Repository<Components>,
    @InjectRepository(Organizations)
    private readonly organizationsRepository: Repository<Organizations>,
    @InjectRepository(WriteoffReasons)
    private readonly writeoffReasonsRepository: Repository<WriteoffReasons>,
    private componentService: ComponentsService,
    private organizationService: OrganizationsService,
    private writeoffReason: WriteoffReasonsService,
    private readonly componentQuantityWatcher: ComponentQuantityWatcherService,
  ) {}

  async getAll() {
    return this.repo.find({
      relations: ['writeoffReasons', 'components', 'factory'],
    });
  }

  async getOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['writeoffReasons', 'components', 'factory'],
    });
  }

  async generateData() {
    const writeOffs = await this.getAll();
    const data: any[] = [];

    if (!writeOffs) throw new Error('Ошибка при поиске списаний!');

    writeOffs.map((item) => {
      const { components, factory, writeoffReasons, ...defaultData } = item;
      const componentsTitle = components?.title;
      const factoryTitle = factory?.shortName;
      const writeoffReasonTitle = writeoffReasons?.title;

      data.push({
        ...defaultData,
        componentsTitle,
        factoryTitle,
        writeoffReasonTitle,
      });
    });

    return data;
  }

  async create(data: WriteoffDTO) {
    const { componentId, factoryId, writeoffReasonId, ...defaultData } = data;

    const component = await this.componentsRepository.findOne({
      where: {
        id: componentId,
      },
      relations: ['componentPlacements'],
    });
    const factory = await this.organizationsRepository.findOne({
      where: { id: factoryId },
      relations: ['organizationTypes', 'peoples'],
    });
    const writeoffReason = await this.writeoffReasonsRepository.findOne({
      where: { id: writeoffReasonId },
    });

    const entity = this.repo.create({
      ...defaultData,
      components: component,
      factory: factory,
      writeoffReasons: writeoffReason,
    } as Partial<Writeoff>);

    const result = await this.repo.save(entity);

    // Автоматически пересчитываем количество компонента
    await this.componentQuantityWatcher.onWriteoffChange(componentId);

    return result;
  }

  async update(id: number, data: Partial<Writeoff>) {
    // Получаем componentId до обновления для последующего пересчета
    const existingRecord = await this.repo.findOne({
      where: { id },
      relations: ['components']
    });

    await this.repo.update(id, data);
    const result = await this.getOne(id);

    // Автоматически пересчитываем количество компонента, если он изменился
    if (existingRecord?.components?.id) {
      await this.componentQuantityWatcher.onWriteoffChange(existingRecord.components.id);
    }

    return result;
  }

  async delete(id: number) {
    try {
      // Получаем componentId до удаления для последующего пересчета
      const existingRecord = await this.repo.findOne({
        where: { id },
        relations: ['components']
      });

      await this.repo.delete(id);

      // Автоматически пересчитываем количество компонента после удаления
      if (existingRecord?.components?.id) {
        await this.componentQuantityWatcher.onWriteoffChange(existingRecord.components.id);
      }
    } catch (e: any) {
      if (e.code === 'ER_ROW_IS_REFERENCED_2') {
        const match = e.sqlMessage.match(/`([^`]+)`\.`([^`]+)`/);
        let tableName = match ? match[2] : '';

        throw new HttpException(
          {
            message: `Невозможно удалить запись. Есть связанные записи в таблице "${tableName}". Удалите их сначала.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw e;
    }
  }
}
