import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SupplierComponents } from '../supplier-components/supplier-components.entity';

@Entity()
export class Suppliers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inn: string;

  @Column()
  kpp: string;

  @Column()
  ogrn: string;

  @Column({ type: 'date' })
  ogrnDate: Date;

  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column()
  legalAddress: string;

  @Column()
  postalAddress: string;

  @Column()
  hasElectronicDocumentFlow: boolean;

  @Column()
  contactPhones: string;

  @Column()
  email: string;

  @Column()
  contactPerson: string;

  @OneToMany(() => SupplierComponents, supplierComponents => supplierComponents.supplier)
  supplierComponents: SupplierComponents[];
}
