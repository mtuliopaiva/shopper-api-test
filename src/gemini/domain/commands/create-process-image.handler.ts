import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ProcessImageWithPromptCommand } from './create-process-image.command';
import { GeminiService } from 'src/gemini/services/gemini.service';

@CommandHandler(ProcessImageWithPromptCommand)
export class ProcessImageWithPromptHandler implements ICommandHandler<ProcessImageWithPromptCommand> {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(command: ProcessImageWithPromptCommand): Promise<{ image_url: string, measure_value: number, measure_uuid: string }> {
    const { imageFileName, customerCode, measureDatetime, measureType } = command;

    return this.geminiService.processExistingImageWithPrompt(imageFileName, customerCode, measureDatetime, measureType);
  }
}
