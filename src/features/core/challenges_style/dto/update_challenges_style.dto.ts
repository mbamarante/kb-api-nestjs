import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengesStyleDto } from './create_challenges_style.dto';

export class UpdateChallengesStyleDto extends PartialType(
  CreateChallengesStyleDto,
) {}
