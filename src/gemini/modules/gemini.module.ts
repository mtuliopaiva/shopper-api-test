import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { GeminiController } from '../controllers/gemini.controller';
import { GeminiService } from '../services/gemini.service';
import { ProcessImageWithPromptHandler } from '../domain/commands/create-process-image.handler';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,  
  ],
  controllers: [GeminiController],
  providers: [
    GeminiService,
    ProcessImageWithPromptHandler,
  ],
  exports: [GeminiService],
})
export class GeminiModule {}
