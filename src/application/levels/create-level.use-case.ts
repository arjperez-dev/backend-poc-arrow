import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { GraphLevelDefinitionValidator } from '../../domain/levels/graph-level-definition';
import { LevelEntity } from '../../domain/levels/level.entity';
import { LEVEL_REPOSITORY } from '../tokens';
import { LevelRepository, SaveLevelData } from '../ports/level.repository';

@Injectable()
export class CreateLevelUseCase {
  private readonly validator = new GraphLevelDefinitionValidator();

  constructor(@Inject(LEVEL_REPOSITORY) private readonly levels: LevelRepository) {}

  async execute(data: SaveLevelData): Promise<LevelEntity> {
    try {
      data.definitionJson = this.validator.validate(data.definitionJson);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Invalid level JSON.');
    }

    const existingLevel = await this.levels.findByNumber(data.number);

    if (existingLevel) {
      throw new ConflictException('A level with this number already exists.');
    }

    return this.levels.create(data);
  }
}
