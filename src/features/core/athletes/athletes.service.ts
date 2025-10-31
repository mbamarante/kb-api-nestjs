import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Athlete } from './entities/athlete.entity';
import { CreateAthleteDto } from './dto/create_athlete.dto';
import { UpdateAthleteDto } from './dto/update_athlete.dto';

@Injectable()
export class AthletesService {
  constructor(
    @InjectRepository(Athlete)
    private athleteRepository: Repository<Athlete>,
  ) {}

  create(createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    const athlete = this.athleteRepository.create(createAthleteDto);
    return this.athleteRepository.save(athlete);
  }

  findAll(): Promise<Athlete[]> {
    return this.athleteRepository.find();
  }

  findOne(id: number): Promise<Athlete | null> {
    return this.athleteRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateAthleteDto: UpdateAthleteDto,
  ): Promise<Athlete | null> {
    await this.athleteRepository.update(id, updateAthleteDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.athleteRepository.delete(id);
  }
}
