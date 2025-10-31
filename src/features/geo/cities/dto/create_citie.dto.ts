import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateCitieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  stateId: number;

  @IsNotEmpty()
  @IsString()
  stateCode: string;

  @IsNotEmpty()
  @IsNumber()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  native?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  translations?: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;

  @IsNotEmpty()
  @IsNumber()
  flag: number;

  @IsString()
  @IsOptional()
  wikidataid?: string;

}
