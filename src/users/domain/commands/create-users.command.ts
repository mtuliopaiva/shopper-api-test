import { ICommand } from '@nestjs/cqrs';
import { CreateUsersDto } from '../dtos/create-users.dto';

export class CreateUsersCommand implements ICommand {
  constructor(
    public readonly createUserDto: CreateUsersDto
  ) {}
}
