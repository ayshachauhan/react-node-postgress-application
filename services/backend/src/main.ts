import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { LoggingInterceptor } from './interceptors/loggingInterceptor';
import logger from './logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');

  const configService = await app.resolve(ConfigService);

  // =========================
  // CORS
  // =========================
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // =========================
  // GLOBAL PIPES
  // =========================
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // =========================
  // INTERCEPTORS
  // =========================
  app.useGlobalInterceptors(new LoggingInterceptor());

  // =========================
  // PORT
  // =========================
  const port: number =
    configService.get<number>(ENVIRONMENT_VARIABLES.BACKEND_PORT) || 1600;

  // =========================
  // SWAGGER
  // =========================
  const config = new DocumentBuilder()
    .setTitle('Azentia')
    .setDescription('The Azentia API description')
    .setVersion('1.0')
    .addTag('Azentia')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'superadmin',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'normal',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // =========================
  // START SERVER
  // =========================
  await app.listen(port);

  logger.info(`Application started at port: ${port}`);
}

bootstrap();
