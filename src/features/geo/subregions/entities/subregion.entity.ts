import { Region } from '@features/geo/regions/entities/region.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('subRegions', { schema: 'geo' })
export class SubRegion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  translations: string | null;

  @ManyToOne(() => Region, { nullable: false, eager: false })
  @JoinColumn({ name: 'region_id' })
  geoRegion: Region;

  @Column({ name: 'region_id' })
  regionId: number;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'smallint', default: 1 })
  flag: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  wikidataid: string | null;
}
