import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Citie } from './entities/citie.entity';
import { CreateCitieDto } from './dto/create_citie.dto';
import { UpdateCitieDto } from './dto/update_citie.dto';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(Citie)
    private citieRepository: Repository<Citie>,
  ) {}

  create(createCitieDto: CreateCitieDto): Promise<Citie> {
    const citie = this.citieRepository.create(createCitieDto);
    return this.citieRepository.save(citie);
  }

  findAll(): Promise<Citie[]> {
    return this.citieRepository.find();
  }

  findOne(id: number): Promise<Citie> {
    return this.citieRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCitieDto: UpdateCitieDto): Promise<Citie> {
    await this.citieRepository.update(id, updateCitieDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.citieRepository.delete(id);
  }
}
