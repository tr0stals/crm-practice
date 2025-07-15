import { Organizations } from 'src/organizations/organizations.entity';

export class BillsForPayDTO {
  date: Date;
  numberBill: string;
  scanPhoto: string;
  expectedSupplyDate: Date;
  totalAmount: number;
  vat: boolean;
  link: string;
  supplierId: number;
  factoryId: number;
}
