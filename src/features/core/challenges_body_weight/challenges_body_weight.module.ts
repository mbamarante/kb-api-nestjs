import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesBodyWeightService } from './challenges_body_weight.service';
import { ChallengesBodyWeightController } from './challenges_body_weight.controller';
import { ChallengesBodyWeight } from './entities/challenges_body_weight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengesBodyWeight])],
  controllers: [ChallengesBodyWeightController],
  providers: [ChallengesBodyWeightService],
  exports: [ChallengesBodyWeightService],
})
export class ChallengesBodyWeightModule {}
