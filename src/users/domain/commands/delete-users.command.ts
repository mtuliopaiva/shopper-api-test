import { ICommand } from '@nestjs/cqrs';

export class DeleteUsersCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
