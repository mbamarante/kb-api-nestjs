import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoterDto } from './create-promoter.dto';

export class UpdatePromoterDto extends PartialType(CreatePromoterDto) {}
