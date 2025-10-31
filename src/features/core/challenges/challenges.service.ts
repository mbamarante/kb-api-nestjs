import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from './entities/challenge.entity';
import { CreateChallengeDto } from './dto/create_challenge.dto';
import { UpdateChallengeDto } from './dto/update_challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
  ) {}

  create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const challenge = this.challengeRepository.create(createChallengeDto);
    return this.challengeRepository.save(challenge);
  }

  findAll(): Promise<Challenge[]> {
    return this.challengeRepository.find();
  }

  findOne(id: number): Promise<Challenge | null> {
    return this.challengeRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge | null> {
    await this.challengeRepository.update(id, updateChallengeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.challengeRepository.delete(id);
  }
}
