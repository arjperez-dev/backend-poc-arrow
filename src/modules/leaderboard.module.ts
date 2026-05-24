import { Module } from '@nestjs/common';
import { GetLeaderboardUseCase } from '../application/leaderboard/get-leaderboard.use-case';
import { SubmitLeaderboardScoreUseCase } from '../application/leaderboard/submit-leaderboard-score.use-case';
import { LEADERBOARD_REPOSITORY } from '../application/tokens';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { PrismaLeaderboardRepository } from '../infrastructure/repositories/prisma-leaderboard.repository';
import { LeaderboardController } from '../interfaces/http/leaderboard/leaderboard.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LeaderboardController],
  providers: [
    GetLeaderboardUseCase,
    SubmitLeaderboardScoreUseCase,
    {
      provide: LEADERBOARD_REPOSITORY,
      useClass: PrismaLeaderboardRepository,
    },
  ],
})
export class LeaderboardModule {}
