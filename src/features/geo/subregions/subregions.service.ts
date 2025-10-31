import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubRegion } from './entities/subregion.entity';
import { CreateSubRegionDto } from './dto/create_subregion.dto';
import { UpdateSubRegionDto } from './dto/update_subregion.dto';

@Injectable()
export class SubRegionsService {
  constructor(
    @InjectRepository(SubRegion)
    private subRegionRepository: Repository<SubRegion>,
  ) {}

  create(createSubRegionDto: CreateSubRegionDto): Promise<SubRegion> {
    const subRegion = this.subRegionRepository.create(createSubRegionDto);
    return this.subRegionRepository.save(subRegion);
  }

  findAll(): Promise<SubRegion[]> {
    return this.subRegionRepository.find();
  }

  findOne(id: number): Promise<SubRegion | null> {
    return this.subRegionRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateSubRegionDto: UpdateSubRegionDto,
  ): Promise<SubRegion | null> {
    await this.subRegionRepository.update(id, updateSubRegionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.subRegionRepository.delete(id);
  }
}
