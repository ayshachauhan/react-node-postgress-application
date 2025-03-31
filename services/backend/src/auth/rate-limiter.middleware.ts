import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly emailRequestCount = new Map<
    string,
    { count: number; timestamp: number }
  >();

  use(req: Request, res: Response, next: NextFunction) {
    const email = req.params.email;
    res && res;
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const currentTime = Date.now();
    const timeWindow = 60 * 60 * 1000; // 1 hour
    const maxRequests = 5;

    const requestInfo = this.emailRequestCount.get(email);

    // Check existing requests
    if (requestInfo) {
      // Within time window
      if (currentTime - requestInfo.timestamp < timeWindow) {
        if (requestInfo.count >= maxRequests) {
          throw new HttpException(
            'Too many password reset requests. Please try again after an hour.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        } else {
          requestInfo.count++;
        }
      } else {
        this.emailRequestCount.set(email, { count: 1, timestamp: currentTime });
      }
    } else {
      this.emailRequestCount.set(email, { count: 1, timestamp: currentTime });
    }

    next();
  }
}
