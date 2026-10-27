import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('detail')
  async getUserDetail() {
    return this.prisma.user.count();
  }

  @Get('list')
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        username: true
      },
      where: {
        username: {
          contains: "o"
        }
      }
    });
  }
}
