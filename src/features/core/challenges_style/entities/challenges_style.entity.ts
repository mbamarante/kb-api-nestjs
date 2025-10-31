import { ChallengesType } from '@features/core/challenges_type/entities/challenges_type.entity';
import { Championship } from '@features/core/championships/entities/championship.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('challenges_style')
export class ChallengesStyle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Championship, { nullable: false, eager: false })
  @JoinColumn({ name: 'championship_id' })
  championship: Championship;

  @Column({ name: 'championship_id' })
  championshipId: number;

  @ManyToOne(() => ChallengesType, { nullable: false, eager: false })
  @JoinColumn({ name: 'challenge_type_id' })
  challengestype: ChallengesType;

  @Column({ name: 'challenge_type_id' })
  challengeTypeId: number;

  @Column()
  description: string;

  @Column({ type: 'smallint', nullable: true })
  isBiathlon: number | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
