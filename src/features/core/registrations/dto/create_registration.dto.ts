import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsOptional()
  uuid?: string;

  @IsNotEmpty()
  @IsNumber()
  championshipId: number;

  @IsNotEmpty()
  @IsNumber()
  athletId: number;

  @IsNotEmpty()
  @IsString()
  team: string;

  @IsNotEmpty()
  @IsString()
  coach: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsDateString()
  @IsOptional()
  weighingAt?: Date;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
