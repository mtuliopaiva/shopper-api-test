import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { TestGeminiCommand } from './create-test-gemini.command';
import { GeminiService } from 'src/gemini/services/gemini.service';

@CommandHandler(TestGeminiCommand)
export class TestGeminiHandler implements ICommandHandler<TestGeminiCommand> {
  constructor(private readonly geminiService: GeminiService) {}

  async execute(command: TestGeminiCommand): Promise<{ response: string }> {
    const prompt = command.prompt;

    const analysisResult = await this.geminiService.testPrompt(prompt);

    return {
      response: analysisResult,
    };
  }
}
