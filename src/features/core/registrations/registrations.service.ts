import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { CreateRegistrationDto } from './dto/create_registration.dto';
import { UpdateRegistrationDto } from './dto/update_registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const registration = this.registrationRepository.create(
      createRegistrationDto,
    );
    return this.registrationRepository.save(registration);
  }

  findAll(): Promise<Registration[]> {
    return this.registrationRepository.find();
  }

  findOne(id: number): Promise<Registration | null> {
    return this.registrationRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateRegistrationDto: UpdateRegistrationDto,
  ): Promise<Registration | null> {
    await this.registrationRepository.update(id, updateRegistrationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.registrationRepository.delete(id);
  }
}
