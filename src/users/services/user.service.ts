import { Injectable, NotFoundException } from '@nestjs/common';
import { Users, Prisma } from '@prisma/client';
import { CreateUsersDto } from '../domain/dtos/create-users.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUsersDto } from '../domain/dtos/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUsersDto): Promise<Users> {
    return this.prisma.users.create({ data });
  }

  async getUserByUuid(uuid: string): Promise<Users> {
    try {
      return await this.prisma.users.findUnique({
        where: { uuid },
      });
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserList(
    page: number,
    itemsPerPage: number,
    search: string,
  ): Promise<[Users[], number]> {
    const skip = (page - 1) * itemsPerPage;
    const take = itemsPerPage;

    const query = this.prisma.users;

    try {
      const total = await query.count({
        where: {
          OR: [
            { name: { contains: search || '', mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
      });

      const users = await query.findMany({
        orderBy: [
          {
            updatedAt: 'desc',
          },
        ],
        where: {
          OR: [
            { name: { contains: search || '', mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
        skip: skip,
        take: take,
      });

      return [users, total];
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async putUser(uuid: string, data: UpdateUsersDto): Promise<Users> {
    try {
      return await this.prisma.users.update({
        where: { uuid },
        data,
      });
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async restoreUser(uuid: string): Promise<Users> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { uuid },
      });

      if (!user || !user.deletedAt) {
        throw new NotFoundException('User not found or not deleted');
      }

      return await this.prisma.users.update({
        where: { uuid },
        data: { deletedAt: null },
      });
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async softDeleteUser(uuid: string): Promise<Users> {
    try {
      return await this.prisma.users.update({
        where: { uuid },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new Error(`Error soft deleting user: ${error.message}`);
    }
  }
}
