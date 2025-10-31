import { PartialType } from '@nestjs/mapped-types';
import { CreateCitieDto } from './create_citie.dto';

export class UpdateCitieDto extends PartialType(CreateCitieDto) {}
