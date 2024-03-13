import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = await app.resolve(ConfigService);
  const logger = await app.resolve(PinoLogger);

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
