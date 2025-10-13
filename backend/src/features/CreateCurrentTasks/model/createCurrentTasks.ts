import { ShipmentCurrentTasksDTO } from 'src/shipments/dto/ShipmentCurrentTasksDTO';
import { ShipmentsDTO } from 'src/shipments/dto/shipmentsDTO';
import { Shipments } from 'src/shipments/shipments.entity';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { ShipmentsStandsService } from 'src/shipments_stands/shipments_stands.service';

export class CurrentTaskBusinessModel {
  private shipmentService: ShipmentsService;
  private shipmentStandService: ShipmentsStandsService;

  private shipmentData: ShipmentsDTO;

  private standId: number;

  constructor({ standId, ...data }: ShipmentCurrentTasksDTO) {
    this.shipmentData = data;
    this.standId = standId;
  }

  private async createShipment(shipmentData: ShipmentsDTO) {
    try {
      const shipmentResponse = await this.shipmentService.create(shipmentData);

      if (!shipmentResponse) {
        throw new Error('Ошибка при создании отгрузки!');
      }

      return shipmentResponse;
    } catch (e) {
      throw new Error(e);
    }
  }

  private async createShipmentStand(shipment) {
    try {
      const shipmentStandResponse = await this.shipmentStandService.create({
        shipmentId: shipment.id,
        standId: this.standId,
      });

      if (!shipmentStandResponse) {
        throw new Error('Ошибка при создании записи shipment_stands');
      }

      return shipmentStandResponse;
    } catch (e) {
      throw new Error(e);
    }
  }

  private async createCurrentTask() {}
}
