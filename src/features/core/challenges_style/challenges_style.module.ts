import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesStyleService } from './challenges_style.service';
import { ChallengesStyleController } from './challenges_style.controller';
import { ChallengesStyle } from './entities/challenges_style.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengesStyle])],
  controllers: [ChallengesStyleController],
  providers: [ChallengesStyleService],
  exports: [ChallengesStyleService],
})
export class ChallengesStyleModule {}
