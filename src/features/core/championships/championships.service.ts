import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Championship } from './entities/championship.entity';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { UpdateChampionshipDto } from './dto/update-championship.dto';

@Injectable()
export class ChampionshipsService {
  constructor(
    @InjectRepository(Championship)
    private championshipRepository: Repository<Championship>,
  ) {}

  create(createChampionshipDto: CreateChampionshipDto): Promise<Championship> {
    const championship = this.championshipRepository.create(
      createChampionshipDto,
    );
    return this.championshipRepository.save(championship);
  }

  findAll(): Promise<Championship[]> {
    return this.championshipRepository.find();
  }

  findOne(id: number): Promise<Championship | null> {
    return this.championshipRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateChampionshipDto: UpdateChampionshipDto,
  ): Promise<Championship | null> {
    await this.championshipRepository.update(id, updateChampionshipDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.championshipRepository.delete(id);
  }
}
