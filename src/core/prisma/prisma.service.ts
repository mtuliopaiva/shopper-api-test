import { PrismaClient } from '@prisma/client';

import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  $httpClient: any;
  async onModuleInit() {
    await this.$connect();
  }
}