import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateChampionshipDto {
  @IsNotEmpty()
  @IsNumber()
  promoterId: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  from: Date;

  @IsNotEmpty()
  @IsDateString()
  to: Date;

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsString()
  @IsOptional()
  uuid?: string;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
