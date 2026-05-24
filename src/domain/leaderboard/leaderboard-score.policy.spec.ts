import { LeaderboardScorePolicy } from './leaderboard-score.policy';

describe('LeaderboardScorePolicy', () => {
  const policy = new LeaderboardScorePolicy();

  it('should_accept_score_when_score_is_higher', () => {
    expect(
      policy.isBetterScore(
        { score: 200, moves: 20, timeSeconds: 60 },
        { score: 100, moves: 10, timeSeconds: 30 },
      ),
    ).toBe(true);
  });

  it('should_accept_score_when_score_ties_and_moves_are_fewer', () => {
    expect(
      policy.isBetterScore(
        { score: 100, moves: 8, timeSeconds: 60 },
        { score: 100, moves: 10, timeSeconds: 30 },
      ),
    ).toBe(true);
  });

  it('should_accept_score_when_score_and_moves_tie_and_time_is_lower', () => {
    expect(
      policy.isBetterScore(
        { score: 100, moves: 10, timeSeconds: 25 },
        { score: 100, moves: 10, timeSeconds: 30 },
      ),
    ).toBe(true);
  });

  it('should_reject_score_when_tiebreakers_are_worse', () => {
    expect(
      policy.isBetterScore(
        { score: 100, moves: 10, timeSeconds: 35 },
        { score: 100, moves: 10, timeSeconds: 30 },
      ),
    ).toBe(false);
  });
});
