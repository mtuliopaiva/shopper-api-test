import { ICommand } from '@nestjs/cqrs';

export class TestGeminiCommand implements ICommand {
  constructor(public readonly prompt: string) {}
}
