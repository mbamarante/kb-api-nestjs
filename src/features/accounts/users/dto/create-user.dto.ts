import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsDateString()
  @IsOptional()
  emailVerifiedAt?: Date;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  rememberToken?: string;

  @IsNumber()
  @IsOptional()
  lastChampionshipId?: number;

  @IsNumber()
  @IsOptional()
  promoterId?: number;

  @IsNotEmpty()
  @IsNumber()
  isAdmin: number;

  @IsNotEmpty()
  @IsNumber()
  isWeighing: number;

  @IsNotEmpty()
  @IsNumber()
  isScoreboard: number;

  @IsNotEmpty()
  @IsNumber()
  isDisplayboard: number;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
