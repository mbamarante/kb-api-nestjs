import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateAgeDto {
  @IsNotEmpty()
  @IsNumber()
  championshipId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  sex: string;

  @IsNumber()
  @IsOptional()
  from?: number;

  @IsNumber()
  @IsOptional()
  to?: number;

  @IsNumber()
  @IsOptional()
  upper?: number;

  @IsNotEmpty()
  @IsNumber()
  isMaster: number;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
