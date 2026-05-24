import { Inject, Injectable } from '@nestjs/common';
import { PlayerProgressEntity } from '../../domain/progress/player-progress.entity';
import { ProgressRepository, SyncProgressData } from '../ports/progress.repository';
import { PROGRESS_REPOSITORY } from '../tokens';

@Injectable()
export class SyncProgressUseCase {
  constructor(@Inject(PROGRESS_REPOSITORY) private readonly progress: ProgressRepository) {}

  async execute(data: SyncProgressData): Promise<PlayerProgressEntity> {
    return this.progress.upsert(data);
  }
}
