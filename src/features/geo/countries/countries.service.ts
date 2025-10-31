import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countrie } from './entities/country.entity';
import { CreateCountrieDto } from './dto/create_countrydto';
import { UpdateCountrieDto } from './dto/update_countrydto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countrie)
    private countrieRepository: Repository<Countrie>,
  ) {}

  create(createCountrieDto: CreateCountrieDto): Promise<Countrie> {
    const countrie = this.countrieRepository.create(createCountrieDto);
    return this.countrieRepository.save(countrie);
  }

  findAll(): Promise<Countrie[]> {
    return this.countrieRepository.find();
  }

  findOne(id: number): Promise<Countrie> {
    return this.countrieRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateCountrieDto: UpdateCountrieDto,
  ): Promise<Countrie> {
    await this.countrieRepository.update(id, updateCountrieDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.countrieRepository.delete(id);
  }
}
