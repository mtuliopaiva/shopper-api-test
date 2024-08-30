import { Controller, Get, Query, InternalServerErrorException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GeminiService } from '../services/gemini.service';

@ApiTags('Gemini')
@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Get('test-prompt')
  async testPrompt(@Query('prompt') prompt: string): Promise<any> {
    try {
      const result = await this.geminiService.testPrompt(prompt);
      return { result };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to process prompt: ${error.message}`);
    }
  }

  @Get('process-existing-image')
  async processExistingImage(
    @Query('fileName') fileName: string,
    @Query('prompt') prompt: string, 
  ): Promise<any> {
    try {
      const result = await this.geminiService.processExistingImageWithPrompt(fileName, prompt);
      return { result };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to process image: ${error.message}`);
    }
  }
}
