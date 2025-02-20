import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import logger from 'src/logger';

const failedLogins = new Map<string, number>();

@Injectable()
export class FailedLoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip = req?.ip || 'unknown'; // Ensuring `ip` is never undefined

    const attempts = failedLogins.get(ip) ?? 0;
    failedLogins.set(ip, attempts + 1);

    if (failedLogins.get(ip)! >= 5) {
      logger.warn('🚨 Multiple failed login attempts detected.');
    }

    return true;
  }
}
