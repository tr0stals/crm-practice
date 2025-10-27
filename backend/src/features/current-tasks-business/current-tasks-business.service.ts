import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentTaskStatesService } from 'src/current_task_states/current_task_states.service';
import { CurrentTasks } from 'src/current_tasks/current_tasks.entity';
import { ShipmentCurrentTasksDTO } from 'src/shipments/dto/ShipmentCurrentTasksDTO';
import { ShipmentsDTO } from 'src/shipments/dto/shipmentsDTO';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { ShipmentsStandsService } from 'src/shipments_stands/shipments_stands.service';
import { StandTasksService } from 'src/stand_tasks/stand_tasks.service';
import { Repository } from 'typeorm';

@Injectable()
export class CurrentTasksBusinessService {
  private standId: number;

  constructor(
    @InjectRepository(CurrentTasks)
    private currentTasksRepo: Repository<CurrentTasks>,

    @Inject(forwardRef(() => ShipmentsService))
    private readonly shipmentsService: ShipmentsService,

    private readonly shipmentsStandsService: ShipmentsStandsService,
    private readonly currentTaskStatesService: CurrentTaskStatesService,
    private readonly standTasksService: StandTasksService,
  ) {}

  async init(data: ShipmentCurrentTasksDTO) {
    console.debug(data);
    const { standId, ...shipmentData } = data;

    const shipmentResponse = await this.createShipment(shipmentData);
    const shipmentStandResponse = await this.createShipmentStand(
      shipmentResponse.id,
      standId,
    );

    // Состояние задачи - "Новая"
    const currentTaskState =
      await this.currentTaskStatesService.getByTitle('Новая');

    const standsTasks = await this.standTasksService.getAllByStand(standId);

    const currentTasks = standsTasks.map((task) => {
      const current = new CurrentTasks();

      current.shipmentStands = shipmentStandResponse;
      current.standTasks = task;
      current.currentTaskStates = currentTaskState;

      return current;
    });

    const currentTasksResponse = await this.currentTasksRepo.save(currentTasks);

    return {
      shipments: shipmentResponse,
      currentTasks: currentTasksResponse,
    };
  }

  private async createShipment(data: ShipmentsDTO) {
    try {
      const shipmentResponse = await this.shipmentsService.create(data);

      if (!shipmentResponse) {
        throw new Error('Ошибка при создании отгрузки!');
      }

      return shipmentResponse;
    } catch (e) {
      throw new Error(e);
    }
  }

  private async createShipmentStand(shipmentId: number, standId: number) {
    try {
      const shipmentStandResponse = await this.shipmentsStandsService.create({
        shipmentId: shipmentId,
        standId: standId,
      });

      if (!shipmentStandResponse) {
        throw new Error('Ошибка при создании записи shipment_stands');
      }

      return shipmentStandResponse;
    } catch (e) {
      throw new Error(e);
    }
  }
}
