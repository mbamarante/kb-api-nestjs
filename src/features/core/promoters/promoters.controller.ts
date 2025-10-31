import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromotersService } from './promoters.service';
import { CreatePromoterDto } from './dto/create-promoter.dto';
import { UpdatePromoterDto } from './dto/update-promoter.dto';

@Controller('promoters')
export class PromotersController {
  constructor(private readonly promotersService: PromotersService) {}

  @Post()
  create(@Body() createPromoterDto: CreatePromoterDto) {
    return this.promotersService.create(createPromoterDto);
  }

  @Get()
  findAll() {
    return this.promotersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromoterDto: UpdatePromoterDto,
  ) {
    return this.promotersService.update(+id, updatePromoterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotersService.remove(+id);
  }
}
