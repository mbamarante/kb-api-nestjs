import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengesStyle } from './entities/challenges_style.entity';
import { CreateChallengesStyleDto } from './dto/create_challenges_style.dto';
import { UpdateChallengesStyleDto } from './dto/update_challenges_style.dto';

@Injectable()
export class ChallengesStyleService {
  constructor(
    @InjectRepository(ChallengesStyle)
    private challengesstyleRepository: Repository<ChallengesStyle>,
  ) {}

  create(
    createChallengesStyleDto: CreateChallengesStyleDto,
  ): Promise<ChallengesStyle> {
    const challengesstyle = this.challengesstyleRepository.create(
      createChallengesStyleDto,
    );
    return this.challengesstyleRepository.save(challengesstyle);
  }

  findAll(): Promise<ChallengesStyle[]> {
    return this.challengesstyleRepository.find();
  }

  findOne(id: number): Promise<ChallengesStyle | null> {
    return this.challengesstyleRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateChallengesStyleDto: UpdateChallengesStyleDto,
  ): Promise<ChallengesStyle | null> {
    await this.challengesstyleRepository.update(id, updateChallengesStyleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.challengesstyleRepository.delete(id);
  }
}
