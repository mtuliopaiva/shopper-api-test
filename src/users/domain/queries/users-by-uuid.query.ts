import { IQuery } from '@nestjs/cqrs';

export class UsersByUuidQuery implements IQuery {
  constructor(
    public readonly uuid: string,
  ) {}
}