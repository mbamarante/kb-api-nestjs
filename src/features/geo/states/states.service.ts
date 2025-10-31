import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { CreateStateDto } from './dto/create_state.dto';
import { UpdateStateDto } from './dto/update_state.dto';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  create(createStateDto: CreateStateDto): Promise<State> {
    const state = this.stateRepository.create(createStateDto);
    return this.stateRepository.save(state);
  }

  findAll(): Promise<State[]> {
    return this.stateRepository.find();
  }

  findOne(id: number): Promise<State> {
    return this.stateRepository.findOne({ where: { id } });
  }

  async update(id: number, updateStateDto: UpdateStateDto): Promise<State> {
    await this.stateRepository.update(id, updateStateDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.stateRepository.delete(id);
  }
}
