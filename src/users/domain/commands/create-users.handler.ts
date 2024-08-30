import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUsersCommand } from './create-users.command';
import { UsersService } from 'src/users/services/user.service';
import { Users } from '@prisma/client';

@CommandHandler(CreateUsersCommand)
export class CreateUsersHandler implements ICommandHandler<CreateUsersCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: CreateUsersCommand): Promise<Users> {
    const { createUserDto } = command;
    return this.usersService.createUser(createUserDto);
  }
}
