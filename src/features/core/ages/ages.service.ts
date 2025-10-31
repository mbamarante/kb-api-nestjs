import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Age } from './entities/age.entity';
import { CreateAgeDto } from './dto/create_age.dto';
import { UpdateAgeDto } from './dto/update_age.dto';

@Injectable()
export class AgesService {
  constructor(
    @InjectRepository(Age)
    private ageRepository: Repository<Age>,
  ) {}

  create(createAgeDto: CreateAgeDto): Promise<Age> {
    const age = this.ageRepository.create(createAgeDto);
    return this.ageRepository.save(age);
  }

  findAll(): Promise<Age[]> {
    return this.ageRepository.find();
  }

  findOne(id: number): Promise<Age | null> {
    return this.ageRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAgeDto: UpdateAgeDto): Promise<Age | null> {
    await this.ageRepository.update(id, updateAgeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ageRepository.delete(id);
  }
}
