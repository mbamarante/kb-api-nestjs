import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationChallengesService } from './registration_challenges.service';
import { RegistrationChallengesController } from './registration_challenges.controller';
import { RegistrationChallenge } from './entities/registration_challenge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationChallenge])],
  controllers: [RegistrationChallengesController],
  providers: [RegistrationChallengesService],
  exports: [RegistrationChallengesService],
})
export class RegistrationChallengesModule {}
