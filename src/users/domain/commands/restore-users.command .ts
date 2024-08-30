import { ICommand } from '@nestjs/cqrs';

export class RestoreUsersCommand implements ICommand {
  constructor(
    public readonly uuid: string ) {}
}
