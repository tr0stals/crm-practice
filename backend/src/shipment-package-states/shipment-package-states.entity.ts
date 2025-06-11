import { ShipmentPackage } from 'src/shipment-package/shipment-package.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShipmentPackageStates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    () => ShipmentPackage,
    (shipmentPackage) => shipmentPackage.shipmentPackageStates,
  )
  shipmentPackages: ShipmentPackage[];
}
