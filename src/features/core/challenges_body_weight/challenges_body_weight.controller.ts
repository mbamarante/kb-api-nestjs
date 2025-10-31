import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengesBodyWeightService } from './challenges_body_weight.service';
import { CreateChallengesBodyWeightDto } from './dto/create_challenges_body_weight.dto';
import { UpdateChallengesBodyWeightDto } from './dto/update_challenges_body_weight.dto';

@Controller('challenges_body_weight')
export class ChallengesBodyWeightController {
  constructor(
    private readonly challengesbodyweightService: ChallengesBodyWeightService,
  ) {}

  @Post()
  create(@Body() createChallengesBodyWeightDto: CreateChallengesBodyWeightDto) {
    return this.challengesbodyweightService.create(
      createChallengesBodyWeightDto,
    );
  }

  @Get()
  findAll() {
    return this.challengesbodyweightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesbodyweightService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengesBodyWeightDto: UpdateChallengesBodyWeightDto,
  ) {
    return this.challengesbodyweightService.update(
      +id,
      updateChallengesBodyWeightDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesbodyweightService.remove(+id);
  }
}
