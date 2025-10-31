import { Championship } from '@features/core/championships/entities/championship.entity';
import { Athlete } from '@features/core/athletes/entities/athlete.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uuid: string | null;

  @ManyToOne(() => Championship, { nullable: false, eager: false })
  @JoinColumn({ name: 'championship_id' })
  championship: Championship;

  @Column({ name: 'championship_id' })
  championshipId: number;

  @ManyToOne(() => Athlete, { nullable: false, eager: false })
  @JoinColumn({ name: 'athlet_id' })
  athlete: Athlete;

  @Column({ name: 'athlet_id' })
  athletId: number;

  @Column()
  team: string;

  @Column()
  coach: string;

  @Column({ type: 'decimal', nullable: true })
  weight: number | null;

  @Column({ type: 'timestamp', nullable: true })
  weighingAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
