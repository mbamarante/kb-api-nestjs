import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCitieDto } from './dto/create_citie.dto';
import { UpdateCitieDto } from './dto/update_citie.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  create(@Body() createCitieDto: CreateCitieDto) {
    return this.citiesService.create(createCitieDto);
  }

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitieDto: UpdateCitieDto) {
    return this.citiesService.update(+id, updateCitieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citiesService.remove(+id);
  }
}
