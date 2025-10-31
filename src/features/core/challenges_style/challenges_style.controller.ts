import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengesStyleService } from './challenges_style.service';
import { CreateChallengesStyleDto } from './dto/create_challenges_style.dto';
import { UpdateChallengesStyleDto } from './dto/update_challenges_style.dto';

@Controller('challenges_style')
export class ChallengesStyleController {
  constructor(
    private readonly challengesstyleService: ChallengesStyleService,
  ) {}

  @Post()
  create(@Body() createChallengesStyleDto: CreateChallengesStyleDto) {
    return this.challengesstyleService.create(createChallengesStyleDto);
  }

  @Get()
  findAll() {
    return this.challengesstyleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesstyleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengesStyleDto: UpdateChallengesStyleDto,
  ) {
    return this.challengesstyleService.update(+id, updateChallengesStyleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesstyleService.remove(+id);
  }
}
