import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('promoters', { schema: 'core' })
export class Promoter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
