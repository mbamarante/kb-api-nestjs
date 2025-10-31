import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChallengesType } from './entities/challenges_type.entity';
import { CreateChallengesTypeDto } from './dto/create_challenges_type.dto';
import { UpdateChallengesTypeDto } from './dto/update_challenges_type.dto';

@Injectable()
export class ChallengesTypeService {
  constructor(
    @InjectRepository(ChallengesType)
    private challengestypeRepository: Repository<ChallengesType>,
  ) {}

  create(
    createChallengesTypeDto: CreateChallengesTypeDto,
  ): Promise<ChallengesType> {
    const challengestype = this.challengestypeRepository.create(
      createChallengesTypeDto,
    );
    return this.challengestypeRepository.save(challengestype);
  }

  findAll(): Promise<ChallengesType[]> {
    return this.challengestypeRepository.find();
  }

  findOne(id: number): Promise<ChallengesType | null> {
    return this.challengestypeRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateChallengesTypeDto: UpdateChallengesTypeDto,
  ): Promise<ChallengesType | null> {
    await this.challengestypeRepository.update(id, updateChallengesTypeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.challengestypeRepository.delete(id);
  }
}
