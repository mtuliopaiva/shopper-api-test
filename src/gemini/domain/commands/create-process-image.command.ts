import { ICommand } from '@nestjs/cqrs';

export class ProcessImageWithPromptCommand implements ICommand {
  constructor(
    public readonly imageFileName: string,
    public readonly customerCode: string,
    public readonly measureDatetime: string,
    public readonly measureType: 'WATER' | 'GAS',
  ) {}
}
