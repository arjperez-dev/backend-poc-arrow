import { Inject, Injectable } from '@nestjs/common';
import { LeaderboardEntryEntity } from '../../domain/leaderboard/leaderboard-entry.entity';
import { LeaderboardRepository } from '../ports/leaderboard.repository';
import { LEADERBOARD_REPOSITORY } from '../tokens';

@Injectable()
export class GetLeaderboardUseCase {
  constructor(
    @Inject(LEADERBOARD_REPOSITORY) private readonly leaderboard: LeaderboardRepository,
  ) {}

  async execute(levelId: string, limit = 20): Promise<LeaderboardEntryEntity[]> {
    return this.leaderboard.getForLevel(levelId, limit);
  }
}
