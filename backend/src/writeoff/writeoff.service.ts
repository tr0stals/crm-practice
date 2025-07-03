import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Writeoff } from './writeoff.entity';
import { WriteoffDTO } from './dto/WriteoffDTO';
import { ComponentsService } from 'src/components/components.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { WriteoffReasonsService } from 'src/writeoff-reasons/writeoff-reasons.service';
import { Components } from 'src/components/components.entity';
import { Organizations } from 'src/organizations/organizations.entity';
import { WriteoffReasons } from 'src/writeoff-reasons/writeoff-reasons.entity';

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

    return await this.repo.save(entity);
  }

  async update(id: number, data: Partial<Writeoff>) {
    await this.repo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
