export type PlayerProgressEntity = {
  id: string;
  userId: string;
  levelId: string;
  completed: boolean;
  bestScore: number | null;
  bestMoves: number | null;
  bestTimeSeconds: number | null;
  updatedAt?: Date;
};
