import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubRegionsService } from './subregions.service';
import { SubRegionsController } from './subregions.controller';
import { SubRegion } from './entities/subregion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubRegion])],
  controllers: [SubRegionsController],
  providers: [SubRegionsService],
  exports: [SubRegionsService],
})
export class SubRegionsModule {}
