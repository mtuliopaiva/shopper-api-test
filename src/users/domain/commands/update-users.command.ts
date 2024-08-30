import { ICommand } from '@nestjs/cqrs';
import { UpdateUsersDto } from '../dtos/update-users.dto';

export class UpdateUsersCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly updateUsersDto: UpdateUsersDto
  ) {}
}
