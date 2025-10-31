import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChampionshipsService } from './championships.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { UpdateChampionshipDto } from './dto/update-championship.dto';

@Controller('championships')
export class ChampionshipsController {
  constructor(private readonly championshipsService: ChampionshipsService) {}

  @Post()
  create(@Body() createChampionshipDto: CreateChampionshipDto) {
    return this.championshipsService.create(createChampionshipDto);
  }

  @Get()
  findAll() {
    return this.championshipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.championshipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChampionshipDto: UpdateChampionshipDto,
  ) {
    return this.championshipsService.update(+id, updateChampionshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.championshipsService.remove(+id);
  }
}
