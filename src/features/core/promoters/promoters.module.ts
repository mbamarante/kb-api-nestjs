import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotersService } from './promoters.service';
import { PromotersController } from './promoters.controller';
import { Promoter } from './entities/promoter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promoter])],
  controllers: [PromotersController],
  providers: [PromotersService],
  exports: [PromotersService],
})
export class PromotersModule {}
