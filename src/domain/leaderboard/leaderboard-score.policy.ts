import { LeaderboardScore } from './leaderboard-entry.entity';

export class LeaderboardScorePolicy {
  isBetterScore(candidate: LeaderboardScore, current: LeaderboardScore | null): boolean {
    if (!current) {
      return true;
    }

    if (candidate.score !== current.score) {
      return candidate.score > current.score;
    }

    if (candidate.moves !== current.moves) {
      return candidate.moves < current.moves;
    }

    return candidate.timeSeconds < current.timeSeconds;
  }
}
