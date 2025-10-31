import { Challenge } from '@features/core/challenges/entities/challenge.entity';
import { Championship } from '@features/core/championships/entities/championship.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('challenges_body_weight')
export class ChallengesBodyWeight {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Championship, { nullable: false, eager: false })
  @JoinColumn({ name: 'championship_id' })
  championship: Championship;

  @Column({ name: 'championship_id' })
  championshipId: number;

  @ManyToOne(() => Challenge, { nullable: false, eager: false })
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;

  @Column({ name: 'challenge_id' })
  challengeId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'int', nullable: true })
  lower: number | null;

  @Column({ type: 'int', nullable: true })
  upper: number | null;

  @Column({ type: 'int', nullable: true })
  above: number | null;

  @Column({ type: 'int', nullable: true })
  none: number | null;

  @Column({ type: 'int', nullable: true })
  wksfQVet1: number | null;

  @Column({ type: 'int', nullable: true })
  wksfQVet2: number | null;

  @Column({ type: 'int', nullable: true })
  wksfQVet3: number | null;

  @Column({ type: 'int', nullable: true })
  wksfQVet4: number | null;

  @Column({ type: 'int', nullable: true })
  wksfQualification: number | null;

  @Column({ type: 'int', nullable: true })
  wksfQualificationVet: number | null;

  @Column({ type: 'int', nullable: true })
  coefficientTable: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coefficientCat: string | null;

  @Column({ type: 'smallint', default: 0 })
  computeCoefficient: number;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
