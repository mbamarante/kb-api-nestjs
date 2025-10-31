import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '@config/database.config';
import { DatabaseModule } from '@infra/database/database.module';
import { UsersModule } from './features/accounts/users/users.module';
import { ChampionshipsModule } from './features/core/championships/championships.module';
import { PromotersModule } from './features/core/promoters/promoters.module';
import { AuthModule } from './features/auth/auth.module';
import { RealtimeModule } from '@infra/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    AuthModule,
    RealtimeModule,
    UsersModule,
    ChampionshipsModule,
    PromotersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
