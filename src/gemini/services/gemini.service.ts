import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

@Injectable()
export class GeminiService {
  private readonly fileManager: GoogleAIFileManager;
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
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
  ): Promise<string> {
    const filePath = path.join('public/uploads', fileName);

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException(`File not found: ${filePath}`);
    }

    try {
      const uploadResponse = await this.fileManager.uploadFile(filePath, {
        mimeType: 'image/jpeg',
        displayName: fileName,
      });

      console.log('uploadResponse', uploadResponse);

      const fileUri = uploadResponse.file.uri;
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: 'Describe the image and reature the measure without the left zeros' }, 
      ]);

      return result.response.text();
    } catch (error) {
      console.error('Error processing image with prompt:', error.message);
      throw new InternalServerErrorException(`Error processing image with prompt: ${error.message}`);
    }
  }
}
