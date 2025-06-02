import { Stands } from "src/stands/stands.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StandsTypes {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(()=> Stands, (type)=>type.standsTypes)
    standsTypes:Stands[];

    @Column()
    name:string;
}