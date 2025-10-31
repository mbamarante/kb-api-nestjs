import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengesBodyWeight } from './entities/challenges_body_weight.entity';
import { CreateChallengesBodyWeightDto } from './dto/create_challenges_body_weight.dto';
import { UpdateChallengesBodyWeightDto } from './dto/update_challenges_body_weight.dto';

@Injectable()
export class ChallengesBodyWeightService {
  constructor(
    @InjectRepository(ChallengesBodyWeight)
    private challengesbodyweightRepository: Repository<ChallengesBodyWeight>,
  ) {}

  create(
    createChallengesBodyWeightDto: CreateChallengesBodyWeightDto,
  ): Promise<ChallengesBodyWeight> {
    const challengesbodyweight = this.challengesbodyweightRepository.create(
      createChallengesBodyWeightDto,
    );
    return this.challengesbodyweightRepository.save(challengesbodyweight);
  }

  findAll(): Promise<ChallengesBodyWeight[]> {
    return this.challengesbodyweightRepository.find();
  }

  findOne(id: number): Promise<ChallengesBodyWeight | null> {
    return this.challengesbodyweightRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateChallengesBodyWeightDto: UpdateChallengesBodyWeightDto,
  ): Promise<ChallengesBodyWeight | null> {
    await this.challengesbodyweightRepository.update(
      id,
      updateChallengesBodyWeightDto,
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.challengesbodyweightRepository.delete(id);
  }
}
