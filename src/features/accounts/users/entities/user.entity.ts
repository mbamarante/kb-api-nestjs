import { Championship } from '@features/core/championships/entities/championship.entity';
import { Promoter } from '@features/core/promoters/entities/promoter.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users', { schema: 'accounts' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rememberToken: string | null;

  @ManyToOne(() => Championship, { nullable: true, eager: false })
  @JoinColumn({ name: 'last_championship_id' })
  championship: Championship | null;

  @Column({ name: 'last_championship_id', type: 'bigint', nullable: true })
  lastChampionshipId: number | null;

  @ManyToOne(() => Promoter, { nullable: true, eager: false })
  @JoinColumn({ name: 'promoter_id' })
  promoter: Promoter | null;

  @Column({ type: 'smallint', default: 0 })
  isAdmin: number;

  @Column({ type: 'smallint', default: 0 })
  isWeighing: number;

  @Column({ type: 'smallint', default: 0 })
  isScoreboard: number;

  @Column({ type: 'smallint', default: 0 })
  isDisplayboard: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
