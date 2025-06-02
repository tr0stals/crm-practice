import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BoxDrawings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column ({length: 255})
    drawingsScan: string;
}