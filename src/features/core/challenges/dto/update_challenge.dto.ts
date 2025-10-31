import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './create_challenge.dto';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {}
