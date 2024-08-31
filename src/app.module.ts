import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GeminiModule } from './gemini/modules/gemini.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CqrsModule,
    GeminiModule,
  ],
})
export class AppModule {} 
