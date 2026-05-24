import { GraphLevelDefinition } from './graph-level-definition';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GenerationType = 'manual' | 'random';

export type LevelEntity = {
  id: string;
  number: number;
  name: string;
  difficulty: Difficulty;
  generationType: GenerationType;
  seed: string | null;
  definitionJson: GraphLevelDefinition;
  createdAt?: Date;
  updatedAt?: Date;
};
