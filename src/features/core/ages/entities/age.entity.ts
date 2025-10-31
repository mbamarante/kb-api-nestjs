import { Championship } from '@features/core/championships/entities/championship.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('ages')
export class Age {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Championship, { nullable: false, eager: false })
  @JoinColumn({ name: 'championship_id' })
  championship: Championship;

  @Column({ name: 'championship_id' })
  championshipId: number;

  @Column()
  description: string;

  @Column()
  sex: string;

  @Column({ type: 'smallint', nullable: true })
  from: number | null;

  @Column({ type: 'smallint', nullable: true })
  to: number | null;

  @Column({ type: 'smallint', nullable: true })
  upper: number | null;

  @Column({ type: 'smallint', default: 0 })
  isMaster: number;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
