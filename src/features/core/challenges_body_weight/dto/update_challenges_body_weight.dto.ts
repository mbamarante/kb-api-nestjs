import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengesBodyWeightDto } from './create_challenges_body_weight.dto';

export class UpdateChallengesBodyWeightDto extends PartialType(
  CreateChallengesBodyWeightDto,
) {}
