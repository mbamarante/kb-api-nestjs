import { Championship } from '@features/core/championships/entities/championship.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('weights')
export class Weight {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Championship, { nullable: false, eager: false })
  @JoinColumn({ name: 'championship_id' })
  championship: Championship;

  @Column({ name: 'championship_id' })
  championshipId: number;

  @Column()
  sex: string;

  @Column()
  description: string;

  @Column({ type: 'smallint' })
  weight: number;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
