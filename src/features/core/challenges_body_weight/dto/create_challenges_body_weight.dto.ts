import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateChallengesBodyWeightDto {
  @IsNotEmpty()
  @IsNumber()
  championshipId: number;

  @IsNotEmpty()
  @IsNumber()
  challengeId: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  lower?: number;

  @IsNumber()
  @IsOptional()
  upper?: number;

  @IsNumber()
  @IsOptional()
  above?: number;

  @IsNumber()
  @IsOptional()
  none?: number;

  @IsNumber()
  @IsOptional()
  wksfQVet1?: number;

  @IsNumber()
  @IsOptional()
  wksfQVet2?: number;

  @IsNumber()
  @IsOptional()
  wksfQVet3?: number;

  @IsNumber()
  @IsOptional()
  wksfQVet4?: number;

  @IsNumber()
  @IsOptional()
  wksfQualification?: number;

  @IsNumber()
  @IsOptional()
  wksfQualificationVet?: number;

  @IsNumber()
  @IsOptional()
  coefficientTable?: number;

  @IsString()
  @IsOptional()
  coefficientCat?: string;

  @IsNotEmpty()
  @IsNumber()
  computeCoefficient: number;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
