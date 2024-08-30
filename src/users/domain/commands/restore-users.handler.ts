import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseHttpException } from "src/core/exceptions/http-base.exceptions";
import { UsersService } from "src/users/services/user.service";
import { ReadUsersDto } from "../dtos/read-users.dto";
import { RestoreUsersCommand } from "./restore-users.command ";


@CommandHandler(RestoreUsersCommand)
export class RestoreUsersHandler
  extends BaseHttpException
  implements ICommandHandler<RestoreUsersCommand>
{
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async execute(command: RestoreUsersCommand): Promise<ReadUsersDto> {

    const { uuid } = command;

    const userData = await this.usersService.restoreUser(uuid);


    return <ReadUsersDto>{
      uuid: userData.uuid,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      deletedAt: userData.deletedAt,
    };
  }
}