import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ENVIRONMENT_VARIABLES } from './enums/environment.enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = await app.resolve(ConfigService);
  await app.listen(configService.get(ENVIRONMENT_VARIABLES.BACKEND_PORT)!);
}

bootstrap();
