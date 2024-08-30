import { CqrsModule } from '@nestjs/cqrs';
import { Module, forwardRef, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { GeminiController } from '../controllers/gemini.controller';
import { TestGeminiHandler } from '../domain/commands/create-test-gemini.handler';
import { GeminiService } from '../services/gemini.service';
import { ProcessImageWithPromptHandler } from '../domain/commands/create-process-image.handler';

export const CommandHandlers = [
  TestGeminiHandler,
  ProcessImageWithPromptHandler 
];

export const QueryHandlers = [
];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
  ],
  controllers: [GeminiController],
  providers: [GeminiService, ...CommandHandlers, ...QueryHandlers],
  exports: [GeminiService],
})
export class FilesModule implements OnModuleInit {
  constructor(private geminiService: GeminiService) {}

  async onModuleInit() {}
}
