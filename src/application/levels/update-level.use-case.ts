import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GraphLevelDefinitionValidator } from '../../domain/levels/graph-level-definition';
import { LevelEntity } from '../../domain/levels/level.entity';
import { LEVEL_REPOSITORY } from '../tokens';
import { LevelRepository, SaveLevelData } from '../ports/level.repository';

@Injectable()
export class UpdateLevelUseCase {
  private readonly validator = new GraphLevelDefinitionValidator();

  constructor(@Inject(LEVEL_REPOSITORY) private readonly levels: LevelRepository) {}

  async execute(id: string, data: SaveLevelData): Promise<LevelEntity> {
    const existingLevel = await this.levels.findById(id);

    if (!existingLevel) {
      throw new NotFoundException('Level not found.');
    }

    try {
      data.definitionJson = this.validator.validate(data.definitionJson);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Invalid level JSON.');
    }

    return this.levels.update(id, data);
  }
}
