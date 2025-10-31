import { PartialType } from '@nestjs/mapped-types';
import { CreateChampionshipDto } from './create_championship.dto';

export class UpdateChampionshipDto extends PartialType(CreateChampionshipDto) {}
