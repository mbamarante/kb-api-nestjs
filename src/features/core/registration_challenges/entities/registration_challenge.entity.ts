import { ChallengesBodyWeight } from '@features/core/challenges_body_weight/entities/challenges_body_weight.entity';
import { Registration } from '@features/core/registrations/entities/registration.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('registration_challenges')
export class RegistrationChallenge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Registration, { nullable: false, eager: false })
  @JoinColumn({ name: 'registration_id' })
  registration: Registration;

  @Column({ name: 'registration_id' })
  registrationId: number;

  @Column({ type: 'bigint' })
  challengeId: number;

  @ManyToOne(() => ChallengesBodyWeight, { nullable: false, eager: false })
  @JoinColumn({ name: 'initial_challenge_body_weight_id' })
  initialChallengesBodyWeight: ChallengesBodyWeight;

  @Column({ name: 'initial_challenge_body_weight_id' })
  initialChallengeBodyWeightId: number;

  @ManyToOne(() => ChallengesBodyWeight, { nullable: false, eager: false })
  @JoinColumn({ name: 'challenge_body_weight_id' })
  challengesBodyWeight: ChallengesBodyWeight;

  @Column({ name: 'challenge_body_weight_id' })
  challengeBodyWeightId: number;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'decimal', nullable: true })
  weightAfterPerformance: number | null;
}
