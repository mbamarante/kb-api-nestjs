import { PartialType } from '@nestjs/mapped-types';
import { CreateAgeDto } from './create_age.dto';

export class UpdateAgeDto extends PartialType(CreateAgeDto) {}
