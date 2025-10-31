import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgesService } from './ages.service';
import { AgesController } from './ages.controller';
import { Age } from './entities/age.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Age])],
  controllers: [AgesController],
  providers: [AgesService],
  exports: [AgesService],
})
export class AgesModule {}
