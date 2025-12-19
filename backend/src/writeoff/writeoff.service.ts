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
import { WsGateway } from 'src/websocket/ws.gateway';
import { NotifyUsersService } from 'src/features/notify-users/notify-users.service';

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
    private readonly wsGateway: WsGateway,

    private readonly notifyUsersService: NotifyUsersService,
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

  async create(data: WriteoffDTO, userId?: string) {
    console.log(
      `[WriteoffService] Создание списания. userId: ${userId}, data:`,
      data,
    );
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

    // Проверяем доступность компонентов перед созданием списания
    const isAvailable =
      await this.componentQuantityWatcher.checkComponentAvailability(
        componentId,
        data.count,
        'writeoff',
        userId,
      );

    if (!isAvailable) {
      // Получаем информацию о компоненте для детального сообщения
      const componentName = component?.title || `Компонент #${componentId}`;

      // Рассчитываем текущее количество для точного сообщения
      const currentCount =
        await this.componentQuantityWatcher.inventarizationBusinessService.calculateComponentCount(
          componentId,
          factoryId,
        );

      const message = `Недостаточно компонентов "${componentName}" для списания. Доступно: ${currentCount.calculatedCount}, требуется: ${data.count}. Операция отменена.`;

      console.log(
        `[WriteoffService] Отправка уведомления о недостатке компонентов. userId: ${userId}, message: ${message}`,
      );

      // Отправляем уведомление через WebSocket
      if (userId) {
        await this.notifyUsersService.sendNotificationToUser(Number(userId), {
          message: message,
          type: 'error',
        });
        console.log(
          `[WriteoffService] Уведомление отправлено пользователю ${userId}`,
        );
      }

      throw new HttpException(
        {
          message: 'Недостаточно компонентов для списания. Операция отменена.',
          type: 'component_insufficient',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

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

  async update(id: number, data: Partial<Writeoff>, userId?: string) {
    console.log(
      `[WriteoffService] Обновление списания. userId: ${userId}, id: ${id}, data:`,
      data,
    );
    // Получаем componentId до обновления для последующего пересчета
    const existingRecord = await this.repo.findOne({
      where: { id },
      relations: ['components', 'factory'],
    });

    if (!existingRecord) {
      throw new Error('Запись списания не найдена');
    }

    // Если изменилось количество компонента, проверяем доступность
    if (data.count !== undefined && data.count !== existingRecord.count) {
      // Вычисляем разницу в количестве
      const countDiff = data.count - existingRecord.count;

      // Если количество увеличивается, проверяем доступность
      if (countDiff > 0) {
        const isAvailable =
          await this.componentQuantityWatcher.checkComponentAvailability(
            existingRecord.components.id,
            countDiff,
            'writeoff',
            userId,
          );

        if (!isAvailable) {
          // Получаем информацию о компоненте для детального сообщения
          const componentName =
            existingRecord.components?.title ||
            `Компонент #${existingRecord.components.id}`;

          // Рассчитываем текущее количество для точного сообщения
          const currentCount =
            await this.componentQuantityWatcher.inventarizationBusinessService.calculateComponentCount(
              existingRecord.components.id,
              existingRecord.factory.id,
            );

          const message = `Недостаточно компонентов "${componentName}" для увеличения списания. Доступно: ${currentCount.calculatedCount}, требуется дополнительно: ${countDiff}. Операция отменена.`;

          console.log(
            `[WriteoffService] Отправка уведомления об увеличении списания. userId: ${userId}, message: ${message}`,
          );

          // Отправляем уведомление через WebSocket
          if (userId) {
            await this.notifyUsersService.sendNotificationToUser(
              Number(userId),
              {
                message: message,
                type: 'error',
              },
            );
            // this.wsGateway.sendNotification(userId, message, 'error');
            console.log(
              `[WriteoffService] Уведомление отправлено пользователю ${userId}`,
            );
          }

          throw new HttpException(
            {
              message:
                'Недостаточно компонентов для увеличения списания. Операция отменена.',
              type: 'component_insufficient',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    await this.repo.update(id, data);
    const result = await this.getOne(id);

    // Автоматически пересчитываем количество компонента, если он изменился
    if (existingRecord?.components?.id) {
      await this.componentQuantityWatcher.onWriteoffChange(
        existingRecord.components.id,
      );
    }

    return result;
  }

  async delete(id: number) {
    try {
      // Получаем componentId до удаления для последующего пересчета
      const existingRecord = await this.repo.findOne({
        where: { id },
        relations: ['components'],
      });

      await this.repo.delete(id);

      // Автоматически пересчитываем количество компонента после удаления
      if (existingRecord?.components?.id) {
        await this.componentQuantityWatcher.onWriteoffChange(
          existingRecord.components.id,
        );
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
