import { State } from '@features/geo/states/entities/state.entity';
import { Country } from '@features/geo/countries/entities/country.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('cities', { schema: 'geo' })
export class Citie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, { nullable: false, eager: false })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @Column({ name: 'state_id' })
  stateId: number;

  @Column()
  stateCode: string;

  @ManyToOne(() => Country, { nullable: false, eager: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column()
  countryCode: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string | null;

  @Column({ type: 'text', nullable: true })
  translations: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wikidataid: string | null;
}
