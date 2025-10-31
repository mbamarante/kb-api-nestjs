import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promoter } from './entities/promoter.entity';
import { CreatePromoterDto } from './dto/create_promoter.dto';
import { UpdatePromoterDto } from './dto/update_promoter.dto';

@Injectable()
export class PromotersService {
  constructor(
    @InjectRepository(Promoter)
    private promoterRepository: Repository<Promoter>,
  ) {}

  create(createPromoterDto: CreatePromoterDto): Promise<Promoter> {
    const promoter = this.promoterRepository.create(createPromoterDto);
    return this.promoterRepository.save(promoter);
  }

  findAll(): Promise<Promoter[]> {
    return this.promoterRepository.find();
  }

  findOne(id: number): Promise<Promoter | null> {
    return this.promoterRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updatePromoterDto: UpdatePromoterDto,
  ): Promise<Promoter | null> {
    await this.promoterRepository.update(id, updatePromoterDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.promoterRepository.delete(id);
  }
}
