import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsersByUuidQuery } from "./users-by-uuid.query";
import { BaseHttpException } from "src/core/exceptions/http-base.exceptions";
import { UsersService } from "src/users/services/user.service";
import { ReadUsersDto } from "../dtos/read-users.dto";

@QueryHandler(UsersByUuidQuery)
export class UserByUuidHandler
  extends BaseHttpException
  implements IQueryHandler<UsersByUuidQuery>
{
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async execute(query: UsersByUuidQuery): Promise<ReadUsersDto> {
    const { uuid } = query;

    const userData = await this.usersService.getUserByUuid(uuid);

    if (!userData) {
      throw new Error('User not found');
    }

    return <ReadUsersDto>{
      uuid: userData.uuid,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      deletedAt: userData.deletedAt,
    }
  }
}
