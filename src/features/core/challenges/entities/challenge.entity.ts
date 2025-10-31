import { ChallengesStyle } from '@features/core/challenges_style/entities/challenges_style.entity';
import { ChallengesType } from '@features/core/challenges_type/entities/challenges_type.entity';
import { Age } from '@features/core/ages/entities/age.entity';
import { Championship } from '@features/core/championships/entities/championship.entity';
import { Weight } from '@features/core/weights/entities/weight.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Championship, { nullable: false, eager: false })
  @JoinColumn({ name: 'championship_id' })
  championship: Championship;

  @Column({ name: 'championship_id' })
  championshipId: number;

  @ManyToOne(() => Age, { nullable: false, eager: false })
  @JoinColumn({ name: 'age_id' })
  age: Age;

  @Column({ name: 'age_id' })
  ageId: number;

  @ManyToOne(() => Weight, { nullable: false, eager: false })
  @JoinColumn({ name: 'weight_id' })
  weight: Weight;

  @Column({ name: 'weight_id' })
  weightId: number;

  @ManyToOne(() => ChallengesType, { nullable: false, eager: false })
  @JoinColumn({ name: 'challenge_type_id' })
  challengestype: ChallengesType;

  @Column({ name: 'challenge_type_id' })
  challengeTypeId: number;

  @ManyToOne(() => ChallengesStyle, { nullable: false, eager: false })
  @JoinColumn({ name: 'challenge_style_id' })
  challengesstyle: ChallengesStyle;

  @Column({ name: 'challenge_style_id' })
  challengeStyleId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  certificateDescription: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reportDescription: string | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
