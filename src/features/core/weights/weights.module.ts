import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightsService } from './weights.service';
import { WeightsController } from './weights.controller';
import { Weight } from './entities/weight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Weight])],
  controllers: [WeightsController],
  providers: [WeightsService],
  exports: [WeightsService],
})
export class WeightsModule {}
