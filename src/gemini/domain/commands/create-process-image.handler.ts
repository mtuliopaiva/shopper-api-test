import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ProcessImageWithPromptCommand } from './create-process-image.command';
import { GeminiService } from 'src/gemini/services/gemini.service';

@CommandHandler(ProcessImageWithPromptCommand)
export class ProcessImageWithPromptHandler implements ICommandHandler<ProcessImageWithPromptCommand> {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(command: ProcessImageWithPromptCommand): Promise<{ response: string }> {
    const { imageFileName } = command;

    const analysisResult = await this.geminiService.processExistingImageWithPrompt(imageFileName);

    return { response: analysisResult };
  }
}
