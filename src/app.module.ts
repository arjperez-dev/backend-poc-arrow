import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './interfaces/http/health/health.controller';
import { AuthModule } from './modules/auth.module';
import { LeaderboardModule } from './modules/leaderboard.module';
import { LevelsModule } from './modules/levels.module';
import { ProgressModule } from './modules/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    LevelsModule,
    ProgressModule,
    LeaderboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
