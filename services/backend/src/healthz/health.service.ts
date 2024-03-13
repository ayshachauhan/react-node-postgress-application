import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class HealthService {
  constructor(
    @InjectPinoLogger(HealthService.name)
    private readonly logger: PinoLogger,
  ) {}

  check() {
    this.logger.info('health service example logger');
    return 'ok';
  }
}
