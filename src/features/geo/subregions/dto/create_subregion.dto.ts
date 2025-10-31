import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateSubRegionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  translations?: string;

  @IsNotEmpty()
  @IsNumber()
  regionId: number;

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
