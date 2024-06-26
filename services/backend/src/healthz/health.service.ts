import { Injectable } from '@nestjs/common';
import logger from 'src/logger';

@Injectable()
export class HealthService {
  constructor() {}

  check() {
    logger.info('health service example logger');
    return 'ok';
  }
}
