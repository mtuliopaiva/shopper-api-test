import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseHttpException } from 'src/core/exceptions/http-base.exceptions';
import { UsersService } from 'src/users/services/user.service';
import { ReadUsersDto } from '../dtos/read-users.dto';
import { DeleteUsersCommand } from './delete-users.command';

@CommandHandler(DeleteUsersCommand)
export class SoftDeleteUserHandler
  extends BaseHttpException
  implements ICommandHandler<DeleteUsersCommand>
{
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async execute(command: DeleteUsersCommand): Promise<ReadUsersDto> {
    const { uuid } = command;

    const userData = await this.usersService.softDeleteUser(uuid);

    return<ReadUsersDto> {
      uuid: userData.uuid,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      deletedAt: userData.deletedAt,
    }
  }
}
