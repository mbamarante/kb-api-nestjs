import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '@config/database.config';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { UsersModule } from './features/user-management/users/users.module';
import { ChampionshipsModule } from './features/core/championships/championships.module';
import { PromotersModule } from './features/core/promoters/promoters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    UsersModule,
    ChampionshipsModule,
    PromotersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
