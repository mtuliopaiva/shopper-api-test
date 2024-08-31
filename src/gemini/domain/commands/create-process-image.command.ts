import { ICommand } from '@nestjs/cqrs';

export class ProcessImageWithPromptCommand implements ICommand {
  constructor(
    public readonly imageFileName: string, 
  ) {}
}
