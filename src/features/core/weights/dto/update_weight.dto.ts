import { PartialType } from '@nestjs/mapped-types';
import { CreateWeightDto } from './create_weight.dto';

export class UpdateWeightDto extends PartialType(CreateWeightDto) {}
