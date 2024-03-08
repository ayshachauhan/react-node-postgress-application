import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';
import { PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.resolve(ConfigService);
  const logger = await app.resolve(PinoLogger);

  const port: number = configService.get(ENVIRONMENT_VARIABLES.BACKEND_PORT)!;

  await app.listen(port);
  logger.info('Application started at port', { port });
}

bootstrap();
