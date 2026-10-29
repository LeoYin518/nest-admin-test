import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ResponseUtil } from '../../common/response.js';
import { Prisma } from '../../generated/prisma/client.js';
import { UserConstants } from '../../common/constants.js';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return ResponseUtil.fail(UserConstants.USER_NOT_EXISTS, 409);
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
        },
        select: {
          id: true,
          username: true,
        },
      });

      return ResponseUtil.success(user);
    } catch (error) {
      // 两个请求同时创建同名账号时，仍可能触发唯一约束冲突。
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return ResponseUtil.fail(UserConstants.USER_NOT_EXISTS, 409);
      }

      throw error;
    }
  }

  async findAll(username: string, pageNum: number, pageSize: number) {
    const select = {
      id: true,
      username: true,
      createdAt: true
    }
    const where = {
      username: {
        contains: username
      }
    }
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;
    const orderBy = {
      id: Prisma.SortOrder.desc
    }
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ select, where, orderBy, skip, take }),
      this.prisma.user.count({ where }),
    ])
    return ResponseUtil.success({
      list: data,
      total
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    return ResponseUtil.success(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    if (user === null) {
      return ResponseUtil.fail(UserConstants.USER_NOT_EXISTS);
    }
    const result = await this.prisma.user.update({
      data: {
        password: updateUserDto.password
      },
      select: {
        id: true,
        updatedAt: true
      },
      where: { id }
    })
    return ResponseUtil.success(result);
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    if (user === null) {
      return ResponseUtil.fail(UserConstants.USER_NOT_EXISTS);
    }
    const result = await this.prisma.user.delete({
      where: {
        id
      }
    })
    return ResponseUtil.success(result);
  }

  async removeByIds(ids: number[]) {
    const result = await this.prisma.user.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    return ResponseUtil.success(result);
  }
}
