import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoterDto } from './create_promoter.dto';

export class UpdatePromoterDto extends PartialType(CreatePromoterDto) {}
