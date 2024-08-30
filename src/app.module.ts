import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GeminiController } from './gemini/controllers/gemini.controller';
import { TestGeminiHandler } from './gemini/domain/commands/create-test-gemini.handler';
import { GeminiService } from './gemini/services/gemini.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CqrsModule,
  ],
  controllers: [GeminiController],
  providers: [GeminiService, TestGeminiHandler],
})
export class AppModule {}
