import { Difficulty, GenerationType, LevelEntity } from '../../domain/levels/level.entity';
import { GraphLevelDefinition } from '../../domain/levels/graph-level-definition';

export type SaveLevelData = {
  number: number;
  name: string;
  difficulty: Difficulty;
  generationType: GenerationType;
  seed: string | null;
  definitionJson: GraphLevelDefinition | unknown;
};

export interface LevelRepository {
  create(data: SaveLevelData): Promise<LevelEntity>;
  findAll(): Promise<LevelEntity[]>;
  findById(id: string): Promise<LevelEntity | null>;
  findByNumber(number: number): Promise<LevelEntity | null>;
  update(id: string, data: SaveLevelData): Promise<LevelEntity>;
}
