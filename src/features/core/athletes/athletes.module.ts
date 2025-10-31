import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthletesService } from './athletes.service';
import { AthletesController } from './athletes.controller';
import { Athlete } from './entities/athlete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Athlete])],
  controllers: [AthletesController],
  providers: [AthletesService],
  exports: [AthletesService],
})
export class AthletesModule {}
