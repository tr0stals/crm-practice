import { License } from "src/license/license.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LicenseTypes {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @OneToMany(() => License, (license) => license.licenseTypes)
      licenseTypes: License[];
}