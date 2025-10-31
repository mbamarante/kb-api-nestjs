import { PartialType } from '@nestjs/mapped-types';
import { CreateCountrieDto } from './create_countrydto';

export class UpdateCountrieDto extends PartialType(CreateCountrieDto) {}
