import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionDto } from './create_region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {}
