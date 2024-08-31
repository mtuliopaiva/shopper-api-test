import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

@Injectable()
export class GeminiService {
  private readonly fileManager: GoogleAIFileManager;
  private readonly genAI: GoogleGenerativeAI;

  constructor(
    private readonly prisma: PrismaService
  ) {
    this.fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async testPrompt(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      throw new InternalServerErrorException(`Error generating content: ${error.message}`);
    }
  }

  async processExistingImageWithPrompt(
    fileName: string,
    customerCode: string,
    measureDatetime: string,
    measureType: 'WATER' | 'GAS'
  ): Promise<{ image_url: string; measure_value: number; measure_uuid: string }> {
    const filePath = path.join('public/uploads', fileName);

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException(`File not found: ${filePath}`);
    }

    try {
      const parsedDate = new Date(measureDatetime);
      if (isNaN(parsedDate.getTime())) {
        throw new InternalServerErrorException(`Invalid date format for measureDatetime: ${measureDatetime}`);
      }

      const uploadResponse = await this.fileManager.uploadFile(filePath, {
        mimeType: 'image/jpeg',
        displayName: fileName,
      });

      const fileUri = uploadResponse.file.uri;
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: 'Analyze the image and extract the measurement value. Please return the value as a whole number without any decimal places or leading zeros.' },
      ]);

      const measureValue = this.extractMeasureValue(result.response.text());
      const measureUuid = uuidv4();
      const imageUrl = fileUri;

      await this.prisma.measures.create({
        data: {
          imageUrl: imageUrl,
          measureValue: measureValue,
          measureUuid: measureUuid,
          customerCode: customerCode,
          measureDatetime: parsedDate,
          measureType: measureType,
        },
      });

      return {
        image_url: imageUrl,
        measure_value: measureValue,
        measure_uuid: measureUuid,
      };
    } catch (error) {
      console.error('Error processing image with prompt:', error.message);
      throw new InternalServerErrorException(`Error processing image with prompt: ${error.message}`);
    }
  }

  private extractMeasureValue(text: string): number {
    const match = text.match(/(\d+\.?\d*)/);
    if (match) {
      return parseFloat(match[1]);
    }
    throw new InternalServerErrorException('Could not extract measurement value from the text.');
  }

  async confirmMeasure(measureUuid: string, confirmedValue: number): Promise<void> {
    try {
      const measure = await this.prisma.measures.findFirst({
        where: { measureUuid },
      });
  
      if (!measure) {
        throw new InternalServerErrorException('Measure not found');
      }
  
      await this.prisma.measures.update({
        where: { measureUuid },
        data: { confirmedValue },
      });
    } catch (error) {
      console.error('Error confirming measure:', error.message);
      throw new InternalServerErrorException(`Error confirming measure: ${error.message}`);
    }
  }
  
  async listMeasuresByCustomerCode(customerCode: string): Promise<any[]> {
    try {
      return await this.prisma.measures.findMany({
        where: { customerCode },
      });
    } catch (error) {
      console.error('Error listing measures:', error.message);
      throw new InternalServerErrorException(`Error listing measures: ${error.message}`);
    }
  }

}
