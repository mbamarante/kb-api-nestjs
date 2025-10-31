import { User } from '@features/accounts/users/entities/user.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('athletes')
export class Athlete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column()
  sex: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cpf: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  team: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coach: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string | null;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  // TODO: Add Country entity when available
  // @ManyToOne(() => Country, { nullable: false, eager: false })
  // @JoinColumn({ name: 'country_id' })
  // country: Country;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
