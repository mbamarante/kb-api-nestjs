import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsNumber()
  championshipId: number;

  @IsNotEmpty()
  @IsNumber()
  ageId: number;

  @IsNotEmpty()
  @IsNumber()
  weightId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeStyleId: number;

  @IsString()
  @IsOptional()
  certificateDescription?: string;

  @IsString()
  @IsOptional()
  reportDescription?: string;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
