export type LeaderboardEntryEntity = {
  id: string;
  userId: string;
  levelId: string;
  score: number;
  moves: number;
  timeSeconds: number;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    id: string;
    displayName: string;
  };
};

export type LeaderboardScore = Pick<
  LeaderboardEntryEntity,
  'score' | 'moves' | 'timeSeconds'
>;
