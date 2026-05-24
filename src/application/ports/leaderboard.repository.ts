import {
  LeaderboardEntryEntity,
  LeaderboardScore,
} from '../../domain/leaderboard/leaderboard-entry.entity';

export type SubmitLeaderboardScoreData = {
  userId: string;
  levelId: string;
  score: number;
  moves: number;
  timeSeconds: number;
};

export interface LeaderboardRepository {
  findByUserAndLevel(userId: string, levelId: string): Promise<LeaderboardEntryEntity | null>;
  getForLevel(levelId: string, limit: number): Promise<LeaderboardEntryEntity[]>;
  upsertBestScore(data: SubmitLeaderboardScoreData): Promise<LeaderboardEntryEntity>;
}

export function toLeaderboardScore(
  entry: LeaderboardEntryEntity | null,
): LeaderboardScore | null {
  if (!entry) {
    return null;
  }

  return {
    score: entry.score,
    moves: entry.moves,
    timeSeconds: entry.timeSeconds,
  };
}
