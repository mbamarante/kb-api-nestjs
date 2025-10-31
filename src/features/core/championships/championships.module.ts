import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampionshipsService } from './championships.service';
import { ChampionshipsController } from './championships.controller';
import { Championship } from './entities/championship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Championship])],
  controllers: [ChampionshipsController],
  providers: [ChampionshipsService],
  exports: [ChampionshipsService],
})
export class ChampionshipsModule {}
