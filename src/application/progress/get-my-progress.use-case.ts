import { Inject, Injectable } from '@nestjs/common';
import { PlayerProgressEntity } from '../../domain/progress/player-progress.entity';
import { ProgressRepository } from '../ports/progress.repository';
import { PROGRESS_REPOSITORY } from '../tokens';

@Injectable()
export class GetMyProgressUseCase {
  constructor(@Inject(PROGRESS_REPOSITORY) private readonly progress: ProgressRepository) {}

  async execute(userId: string): Promise<PlayerProgressEntity[]> {
    return this.progress.findByUserId(userId);
  }
}
