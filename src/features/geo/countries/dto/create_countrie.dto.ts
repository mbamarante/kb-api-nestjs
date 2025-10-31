import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateCountrieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  iso3?: string;

  @IsString()
  @IsOptional()
  numericCode?: string;

  @IsString()
  @IsOptional()
  iso2?: string;

  @IsString()
  @IsOptional()
  phonecode?: string;

  @IsString()
  @IsOptional()
  capital?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  currencyName?: string;

  @IsString()
  @IsOptional()
  currencySymbol?: string;

  @IsString()
  @IsOptional()
  tld?: string;

  @IsString()
  @IsOptional()
  native?: string;

  @IsNumber()
  @IsOptional()
  population?: number;

  @IsNumber()
  @IsOptional()
  gdp?: number;

  @IsString()
  @IsOptional()
  region?: string;

  @IsNumber()
  @IsOptional()
  regionId?: number;

  @IsString()
  @IsOptional()
  subRegion?: string;

  @IsNumber()
  @IsOptional()
  subRegionId?: number;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  timezones?: string;

  @IsString()
  @IsOptional()
  translations?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  emoji?: string;

  @IsString()
  @IsOptional()
  emojiu?: string;

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
}
