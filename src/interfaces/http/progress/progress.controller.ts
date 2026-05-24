import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetMyProgressUseCase } from '../../../application/progress/get-my-progress.use-case';
import { SyncProgressUseCase } from '../../../application/progress/sync-progress.use-case';
import { PlayerProgressEntity } from '../../../domain/progress/player-progress.entity';
import { AuthenticatedRequest } from '../auth/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SyncProgressDto } from './dto/sync-progress.dto';

@ApiTags('progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    private readonly syncProgress: SyncProgressUseCase,
    private readonly getMyProgress: GetMyProgressUseCase,
  ) {}

  @Post('sync')
  @ApiOkResponse({ description: 'Upserts authenticated player progress.' })
  async sync(
    @Req() request: AuthenticatedRequest,
    @Body() dto: SyncProgressDto,
  ): Promise<PlayerProgressEntity> {
    return this.syncProgress.execute({
      userId: request.user.id,
      levelId: dto.levelId,
      completed: dto.completed,
      bestScore: dto.bestScore ?? null,
      bestMoves: dto.bestMoves ?? null,
      bestTimeSeconds: dto.bestTimeSeconds ?? null,
    });
  }

  @Get('me')
  @ApiOkResponse({ description: 'Returns progress for the authenticated user.' })
  async findMine(@Req() request: AuthenticatedRequest): Promise<PlayerProgressEntity[]> {
    return this.getMyProgress.execute(request.user.id);
  }
}
