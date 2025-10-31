import { Region } from '@features/geo/regions/entities/region.entity';
import { SubRegion } from '@features/geo/subregions/entities/subregion.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('countries', { schema: 'geo' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iso3: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  numericCode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iso2: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phonecode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  capital: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currency: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currencyName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  currencySymbol: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tld: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native: string | null;

  @Column({ type: 'bigint', nullable: true })
  population: number | null;

  @Column({ type: 'bigint', nullable: true })
  gdp: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string | null;

  @ManyToOne(() => Region, { nullable: true, eager: false })
  @JoinColumn({ name: 'region_id' })
  geoRegion: Region;

  @Column({ name: 'region_id', nullable: true })
  regionId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subRegion: string | null;

  @ManyToOne(() => SubRegion, { nullable: true, eager: false })
  @JoinColumn({ name: 'sub_region_id' })
  geoSubRegion: SubRegion;

  @Column({ name: 'sub_region_id', nullable: true })
  subRegionId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nationality: string | null;

  @Column({ type: 'text', nullable: true })
  timezones: string | null;

  @Column({ type: 'text', nullable: true })
  translations: string | null;

  @Column({ type: 'decimal', nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', nullable: true })
  longitude: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emoji: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emojiu: string | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wikidataid: string | null;
}
