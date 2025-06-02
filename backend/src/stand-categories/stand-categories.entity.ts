import { Stands } from "src/stands/stands.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StandCategories{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(()=> Stands, (category)=>category.standsCategories)
    standcategories:Stands[];

    @Column()
    name:string;

    @Column()
    image:string;

    @Column()
    comment:string;
}