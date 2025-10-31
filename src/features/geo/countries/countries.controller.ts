import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountrieDto } from './dto/create_countrydto';
import { UpdateCountrieDto } from './dto/update_countrydto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  create(@Body() createCountrieDto: CreateCountrieDto) {
    return this.countriesService.create(createCountrieDto);
  }

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCountrieDto: UpdateCountrieDto,
  ) {
    return this.countriesService.update(+id, updateCountrieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(+id);
  }
}
