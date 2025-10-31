import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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

}
