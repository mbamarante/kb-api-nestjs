import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RegistrationChallengesService } from './registration_challenges.service';
import { CreateRegistrationChallengeDto } from './dto/create_registration_challenge.dto';
import { UpdateRegistrationChallengeDto } from './dto/update_registration_challenge.dto';

@Controller('registration_challenges')
export class RegistrationChallengesController {
  constructor(
    private readonly registrationchallengesService: RegistrationChallengesService,
  ) {}

  @Post()
  create(
    @Body() createRegistrationChallengeDto: CreateRegistrationChallengeDto,
  ) {
    return this.registrationchallengesService.create(
      createRegistrationChallengeDto,
    );
  }

  @Get()
  findAll() {
    return this.registrationchallengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrationchallengesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistrationChallengeDto: UpdateRegistrationChallengeDto,
  ) {
    return this.registrationchallengesService.update(
      +id,
      updateRegistrationChallengeDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrationchallengesService.remove(+id);
  }
}
