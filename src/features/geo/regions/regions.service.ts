import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create_region.dto';
import { UpdateRegionDto } from './dto/update_region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  create(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }

  findAll(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  findOne(id: number): Promise<Region> {
    return this.regionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region> {
    await this.regionRepository.update(id, updateRegionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.regionRepository.delete(id);
  }
}
