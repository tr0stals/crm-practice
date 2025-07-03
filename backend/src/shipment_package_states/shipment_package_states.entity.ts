import { ShipmentPackage } from 'src/shipment_package/shipment_package.entity';
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
