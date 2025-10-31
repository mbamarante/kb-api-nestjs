import { PartialType } from '@nestjs/mapped-types';
import { CreateSubRegionDto } from './create_subregion.dto';

export class UpdateSubRegionDto extends PartialType(CreateSubRegionDto) {}
