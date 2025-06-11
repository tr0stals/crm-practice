import { PCBS } from 'src/pcbs/pcbs.entity';
import { WarehouseComponents } from 'src/warehouse-components/warehouse-components.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PcbWarehouseComponents {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PCBS, (pcb) => pcb.pcbWarehouseComponents)
  @JoinColumn({ name: 'pcbId' })
  pcbs: PCBS;

  @ManyToOne(
    () => WarehouseComponents,
    (warehouseComponent) => warehouseComponent.pcbWarehouseComponents,
  )
  @JoinColumn({ name: 'warehouseComponentId' })
  warehouseComponents: WarehouseComponents;
}
