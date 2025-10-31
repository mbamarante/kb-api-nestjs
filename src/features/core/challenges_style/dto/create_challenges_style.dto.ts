import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateChallengesStyleDto {
  @IsNotEmpty()
  @IsNumber()
  championshipId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeTypeId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  isBiathlon?: number;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
