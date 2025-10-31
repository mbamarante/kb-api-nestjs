import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengesTypeDto } from './create_challenges_type.dto';

export class UpdateChallengesTypeDto extends PartialType(
  CreateChallengesTypeDto,
) {}
