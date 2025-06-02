import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SendingBoxes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sendId: number;

    @Column()
    boxDrawingsId: number;
}