import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengesTypeService } from './challenges_type.service';
import { CreateChallengesTypeDto } from './dto/create_challenges_type.dto';
import { UpdateChallengesTypeDto } from './dto/update_challenges_type.dto';

@Controller('challenges_type')
export class ChallengesTypeController {
  constructor(private readonly challengestypeService: ChallengesTypeService) {}

  @Post()
  create(@Body() createChallengesTypeDto: CreateChallengesTypeDto) {
    return this.challengestypeService.create(createChallengesTypeDto);
  }

  @Get()
  findAll() {
    return this.challengestypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengestypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengesTypeDto: UpdateChallengesTypeDto,
  ) {
    return this.challengestypeService.update(+id, updateChallengesTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengestypeService.remove(+id);
  }
}
