import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WeightsService } from './weights.service';
import { CreateWeightDto } from './dto/create_weight.dto';
import { UpdateWeightDto } from './dto/update_weight.dto';

@Controller('weights')
export class WeightsController {
  constructor(private readonly weightsService: WeightsService) {}

  @Post()
  create(@Body() createWeightDto: CreateWeightDto) {
    return this.weightsService.create(createWeightDto);
  }

  @Get()
  findAll() {
    return this.weightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weightsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeightDto: UpdateWeightDto) {
    return this.weightsService.update(+id, updateWeightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weightsService.remove(+id);
  }
}
