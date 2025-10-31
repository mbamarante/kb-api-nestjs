import { Country } from '@features/geo/countries/entities/country.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('states', { schema: 'geo' })
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Country, { nullable: false, eager: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column()
  countryCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fipsCode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iso2: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iso31662: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type: string | null;

  @Column({ type: 'int', nullable: true })
  level: number | null;

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string | null;

  @Column({ type: 'decimal', nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', nullable: true })
  longitude: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone: string | null;

  @Column({ type: 'text', nullable: true })
  translations: string | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wikidataid: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  population: string | null;
}
