import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    const webpack = await import('webpack');
    const webpackDevMiddleware = await import('webpack-dev-middleware');
    const webpackHotMiddleware = await import('webpack-hot-middleware');
    const webpackConfig = require('../webpack.config');

    const compiler = webpack.default(webpackConfig);
    app.use(
      webpackDevMiddleware.default(compiler, {
        publicPath: webpackConfig.output.publicPath,
      }),
    );
    app.use(webpackHotMiddleware.default(compiler));
  }

  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }),
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Shopper - Project - API')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
bootstrap();
