import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationChallenge } from './entities/registration_challenge.entity';
import { CreateRegistrationChallengeDto } from './dto/create_registration_challenge.dto';
import { UpdateRegistrationChallengeDto } from './dto/update_registration_challenge.dto';

@Injectable()
export class RegistrationChallengesService {
  constructor(
    @InjectRepository(RegistrationChallenge)
    private registrationchallengeRepository: Repository<RegistrationChallenge>,
  ) {}

  create(
    createRegistrationChallengeDto: CreateRegistrationChallengeDto,
  ): Promise<RegistrationChallenge> {
    const registrationchallenge = this.registrationchallengeRepository.create(
      createRegistrationChallengeDto,
    );
    return this.registrationchallengeRepository.save(registrationchallenge);
  }

  findAll(): Promise<RegistrationChallenge[]> {
    return this.registrationchallengeRepository.find();
  }

  findOne(id: number): Promise<RegistrationChallenge | null> {
    return this.registrationchallengeRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateRegistrationChallengeDto: UpdateRegistrationChallengeDto,
  ): Promise<RegistrationChallenge | null> {
    await this.registrationchallengeRepository.update(
      id,
      updateRegistrationChallengeDto,
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.registrationchallengeRepository.delete(id);
  }
}
