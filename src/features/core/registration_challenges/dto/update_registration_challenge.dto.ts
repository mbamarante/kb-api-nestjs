import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationChallengeDto } from './create_registration_challenge.dto';

export class UpdateRegistrationChallengeDto extends PartialType(
  CreateRegistrationChallengeDto,
) {}
