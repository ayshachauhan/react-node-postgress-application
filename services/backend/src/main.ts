import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { LoggingInterceptor } from './interceptors/loggingInterceptor';
import logger from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = await app.resolve(ConfigService);

  const frontendBaseUrl = configService.get(
    ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL,
  )!;

  app.enableCors({
    origin: [frontendBaseUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const nonce = Buffer.from(Date.now().toString()).toString('base64');

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", `'nonce-${nonce}'`],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
          'font-src': ["'self'", 'https:', 'data:'],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
          'frame-ancestors': ["'self'"],
        },
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // This ensures that transformation takes place
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port: number = configService.get(ENVIRONMENT_VARIABLES.BACKEND_PORT)!;

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
        'x-tokenName': 'authorization',
      },
      'superadmin',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
        'x-tokenName': 'authorization',
      },
      'normal',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  logger.info(`Application started at port: ${port}`);
}

bootstrap();
