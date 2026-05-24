import { Injectable } from '@nestjs/common';
import { LeaderboardEntry, User } from '@prisma/client';
import {
  LeaderboardRepository,
  SubmitLeaderboardScoreData,
} from '../../application/ports/leaderboard.repository';
import { LeaderboardEntryEntity } from '../../domain/leaderboard/leaderboard-entry.entity';
import { PrismaService } from '../database/prisma.service';

type LeaderboardEntryWithUser = LeaderboardEntry & {
  user?: Pick<User, 'id' | 'displayName'>;
};

@Injectable()
export class PrismaLeaderboardRepository implements LeaderboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserAndLevel(
    userId: string,
    levelId: string,
  ): Promise<LeaderboardEntryEntity | null> {
    const entry = await this.prisma.leaderboardEntry.findUnique({
      where: {
        userId_levelId: {
          userId,
          levelId,
        },
      },
    });

    return entry ? this.mapEntry(entry) : null;
  }

  async getForLevel(levelId: string, limit: number): Promise<LeaderboardEntryEntity[]> {
    const entries = await this.prisma.leaderboardEntry.findMany({
      where: { levelId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
      orderBy: [{ score: 'desc' }, { moves: 'asc' }, { timeSeconds: 'asc' }],
      take: limit,
    });

    return entries.map((entry) => this.mapEntry(entry));
  }

  async upsertBestScore(data: SubmitLeaderboardScoreData): Promise<LeaderboardEntryEntity> {
    const entry = await this.prisma.leaderboardEntry.upsert({
      where: {
        userId_levelId: {
          userId: data.userId,
          levelId: data.levelId,
        },
      },
      update: {
        score: data.score,
        moves: data.moves,
        timeSeconds: data.timeSeconds,
      },
      create: data,
    });

    return this.mapEntry(entry);
  }

  private mapEntry(entry: LeaderboardEntryWithUser): LeaderboardEntryEntity {
    return {
      id: entry.id,
      userId: entry.userId,
      levelId: entry.levelId,
      score: entry.score,
      moves: entry.moves,
      timeSeconds: entry.timeSeconds,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      user: entry.user
        ? {
            id: entry.user.id,
            displayName: entry.user.displayName,
          }
        : undefined,
    };
  }
}
