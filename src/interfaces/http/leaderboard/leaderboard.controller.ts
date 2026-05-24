import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetLeaderboardUseCase } from '../../../application/leaderboard/get-leaderboard.use-case';
import { SubmitLeaderboardScoreUseCase } from '../../../application/leaderboard/submit-leaderboard-score.use-case';
import { LeaderboardEntryEntity } from '../../../domain/leaderboard/leaderboard-entry.entity';
import { AuthenticatedRequest } from '../auth/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitLeaderboardScoreDto } from './dto/submit-leaderboard-score.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly getLeaderboard: GetLeaderboardUseCase,
    private readonly submitScore: SubmitLeaderboardScoreUseCase,
  ) {}

  @Get(':levelId')
  @ApiOkResponse({ description: 'Returns best scores for a level.' })
  async findForLevel(@Param('levelId') levelId: string): Promise<LeaderboardEntryEntity[]> {
    return this.getLeaderboard.execute(levelId);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Submits the authenticated user score if it is better.' })
  async submit(
    @Req() request: AuthenticatedRequest,
    @Body() dto: SubmitLeaderboardScoreDto,
  ): Promise<LeaderboardEntryEntity> {
    return this.submitScore.execute({
      userId: request.user.id,
      levelId: dto.levelId,
      score: dto.score,
      moves: dto.moves,
      timeSeconds: dto.timeSeconds,
    });
  }
}
