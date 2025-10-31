import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weight } from './entities/weight.entity';
import { CreateWeightDto } from './dto/create_weight.dto';
import { UpdateWeightDto } from './dto/update_weight.dto';

@Injectable()
export class WeightsService {
  constructor(
    @InjectRepository(Weight)
    private weightRepository: Repository<Weight>,
  ) {}

  create(createWeightDto: CreateWeightDto): Promise<Weight> {
    const weight = this.weightRepository.create(createWeightDto);
    return this.weightRepository.save(weight);
  }

  findAll(): Promise<Weight[]> {
    return this.weightRepository.find();
  }

  findOne(id: number): Promise<Weight | null> {
    return this.weightRepository.findOne({ where: { id } });
  }

  async update(id: number, updateWeightDto: UpdateWeightDto): Promise<Weight | null> {
    await this.weightRepository.update(id, updateWeightDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.weightRepository.delete(id);
  }
}
