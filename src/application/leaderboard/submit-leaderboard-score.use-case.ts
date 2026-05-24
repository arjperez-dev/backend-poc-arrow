import { Inject, Injectable } from '@nestjs/common';
import { LeaderboardEntryEntity } from '../../domain/leaderboard/leaderboard-entry.entity';
import { LeaderboardScorePolicy } from '../../domain/leaderboard/leaderboard-score.policy';
import {
  LeaderboardRepository,
  SubmitLeaderboardScoreData,
  toLeaderboardScore,
} from '../ports/leaderboard.repository';
import { LEADERBOARD_REPOSITORY } from '../tokens';

@Injectable()
export class SubmitLeaderboardScoreUseCase {
  private readonly scorePolicy = new LeaderboardScorePolicy();

  constructor(
    @Inject(LEADERBOARD_REPOSITORY) private readonly leaderboard: LeaderboardRepository,
  ) {}

  async execute(data: SubmitLeaderboardScoreData): Promise<LeaderboardEntryEntity> {
    const currentEntry = await this.leaderboard.findByUserAndLevel(data.userId, data.levelId);
    const candidate = {
      score: data.score,
      moves: data.moves,
      timeSeconds: data.timeSeconds,
    };

    if (!this.scorePolicy.isBetterScore(candidate, toLeaderboardScore(currentEntry))) {
      return currentEntry as LeaderboardEntryEntity;
    }

    return this.leaderboard.upsertBestScore(data);
  }
}
