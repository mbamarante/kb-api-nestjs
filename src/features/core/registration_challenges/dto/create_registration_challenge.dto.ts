import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateRegistrationChallengeDto {
  @IsNotEmpty()
  @IsNumber()
  registrationId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeId: number;

  @IsNotEmpty()
  @IsNumber()
  initialChallengeBodyWeightId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeBodyWeightId: number;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;

  @IsNumber()
  @IsOptional()
  weightAfterPerformance?: number;
}
