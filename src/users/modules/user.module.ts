import { CqrsModule } from '@nestjs/cqrs';
import { Module, forwardRef, OnModuleInit } from '@nestjs/common';

import { PrismaModule } from 'src/core/prisma/prisma.module';
import { UsersListHandler } from '../domain/queries/list-users.handler';
import { UsersController } from '../controllers/user.controller';
import { UsersService } from '../services/user.service';
import { CreateUsersHandler } from '../domain/commands/create-users.handler';
import { UserByUuidHandler } from '../domain/queries/users-by-uuid.handler';
import { UpdateUsersHandler } from '../domain/commands/update-users.handler';
import { SoftDeleteUserHandler } from '../domain/commands/delete-users.handler';
import { RestoreUsersHandler } from '../domain/commands/restore-users.handler';

export const CommandHandlers = [
  CreateUsersHandler,
  UpdateUsersHandler,
  RestoreUsersHandler,
  SoftDeleteUserHandler
];

export const QueryHandlers = [
  UsersListHandler,
  UserByUuidHandler,
];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ...CommandHandlers, ...QueryHandlers],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private userService: UsersService) {}

  async onModuleInit() {}
}
