import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateStateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsString()
  @IsOptional()
  fipsCode?: string;

  @IsString()
  @IsOptional()
  iso2?: string;

  @IsString()
  @IsOptional()
  iso31662?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  level?: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsOptional()
  native?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  translations?: string;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;

  @IsNotEmpty()
  @IsNumber()
  flag: number;

  @IsString()
  @IsOptional()
  wikidataid?: string;

  @IsString()
  @IsOptional()
  population?: string;

}
