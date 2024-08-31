import { Controller, Get, Query, InternalServerErrorException, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GeminiService } from '../services/gemini.service';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessImageWithPromptCommand } from '../domain/commands/create-process-image.command';

@ApiTags('Gemini')
@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly commandBus: CommandBus,
  ) {}

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
    @Query('customer_code') customerCode: string,
    @Query('measure_datetime') measureDatetime: string,
    @Query('measure_type') measureType: 'WATER' | 'GAS',
  ): Promise<any> {
    try {
      const result = await this.geminiService.processExistingImageWithPrompt(fileName, customerCode, measureDatetime, measureType);
      return { result };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to process image: ${error.message}`);
    }
  }

  @Patch('confirm-measure')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        measure_uuid: { type: 'string' },
        confirmed_value: { type: 'number' },
      },
      required: ['measure_uuid', 'confirmed_value'],
    },
  })
  async confirmMeasure(
    @Body('measure_uuid') measureUuid: string,
    @Body('confirmed_value') confirmedValue: number,
  ): Promise<{ success: boolean }> {
    try {
      await this.geminiService.confirmMeasure(measureUuid, confirmedValue);
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException({
        error_code: 'INVALID_DATA',
        error_description: error.message,
      });
    }
  }

  @Get(':customer_code/list')
  async listMeasuresByCustomerCode(
    @Param('customer_code') customerCode: string,
  ): Promise<any> {
    try {
      return await this.geminiService.listMeasuresByCustomerCode(customerCode);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to list measures: ${error.message}`);
    }
  }
}
