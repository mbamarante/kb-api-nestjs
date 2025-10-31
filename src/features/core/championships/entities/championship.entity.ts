import { Promoter } from '@features/core/promoters/entities/promoter.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('championships', { schema: 'core' })
export class Championship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Promoter, { nullable: false, eager: false })
  @JoinColumn({ name: 'promoter_id' })
  promoter: Promoter;

  @Column()
  promoterId: number;

  @Column()
  description: string;

  @Column({ type: 'date' })
  from: Date;

  @Column({ type: 'date' })
  to: Date;

  @Column()
  place: string;

  @Column({ type: 'uuid', nullable: true })
  uuid: string | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
