import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesTypeService } from './challenges_type.service';
import { ChallengesTypeController } from './challenges_type.controller';
import { ChallengesType } from './entities/challenges_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengesType])],
  controllers: [ChallengesTypeController],
  providers: [ChallengesTypeService],
  exports: [ChallengesTypeService],
})
export class ChallengesTypeModule {}
