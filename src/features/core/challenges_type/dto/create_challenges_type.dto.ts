import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateChallengesTypeDto {
  @IsNotEmpty()
  @IsNumber()
  championshipId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
