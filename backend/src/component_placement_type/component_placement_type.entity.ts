import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ComponentPlacementType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  title: string;
} 