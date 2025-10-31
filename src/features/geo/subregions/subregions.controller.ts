import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubRegionsService } from './subregions.service';
import { CreateSubRegionDto } from './dto/create_subregion.dto';
import { UpdateSubRegionDto } from './dto/update_subregion.dto';

@Controller('subRegions')
export class SubRegionsController {
  constructor(private readonly subRegionsService: SubRegionsService) {}

  @Post()
  create(@Body() createSubRegionDto: CreateSubRegionDto) {
    return this.subRegionsService.create(createSubRegionDto);
  }

  @Get()
  findAll() {
    return this.subRegionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subRegionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubRegionDto: UpdateSubRegionDto,
  ) {
    return this.subRegionsService.update(+id, updateSubRegionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subRegionsService.remove(+id);
  }
}
