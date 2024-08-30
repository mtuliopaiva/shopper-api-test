import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UsersListQuery } from './list-users.query';
import { UsersService } from 'src/users/services/user.service';
import { ListUsersDto } from '../dtos/list-users.dto';
import { BaseHttpException } from 'src/core/exceptions/http-base.exceptions';
import { ReadUsersDto } from '../dtos/read-users.dto';

@QueryHandler(UsersListQuery)
export class UsersListHandler
  extends BaseHttpException
  implements IQueryHandler<UsersListQuery>
{
  constructor(private readonly userService: UsersService) {
    super();
  }

  async execute(query: UsersListQuery): Promise<ListUsersDto> {
    const { page, itemsPerPage, search } = query;

    const [users, total] = await this.userService.getUserList(
      page,
      itemsPerPage,
      search,
    );

    return <ListUsersDto>{
      data: users.length
        ? users.map(
            (userData) =>
              <ReadUsersDto>{
                uuid: userData.uuid,
                name: userData.name,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                deletedAt: userData.deletedAt,
              },
          )
        : [],
      total: total,
    };
  }
}
