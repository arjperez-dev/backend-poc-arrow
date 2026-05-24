import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { CreateUserData, UserRepository } from '../../application/ports/user.repository';
import { UserEntity } from '../../domain/users/user.entity';
import { UserRole } from '../../domain/users/user-role';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        passwordHash: data.passwordHash,
        role: data.role ?? UserRole.PLAYER,
      },
    });

    return this.mapUser(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.mapUser(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.mapUser(user) : null;
  }

  private mapUser(user: PrismaUser): UserEntity {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      role: user.role as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
