import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LevelEntity } from '../../domain/levels/level.entity';
import { LevelRepository } from '../ports/level.repository';
import { LEVEL_REPOSITORY } from '../tokens';

@Injectable()
export class GetLevelsUseCase {
  constructor(@Inject(LEVEL_REPOSITORY) private readonly levels: LevelRepository) {}

  async execute(): Promise<LevelEntity[]> {
    return this.levels.findAll();
  }
}

@Injectable()
export class GetLevelByIdUseCase {
  constructor(@Inject(LEVEL_REPOSITORY) private readonly levels: LevelRepository) {}

  async execute(id: string): Promise<LevelEntity> {
    const level = await this.levels.findById(id);

    if (!level) {
      throw new NotFoundException('Level not found.');
    }

    return level;
  }
}
