import { HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function createRateLimiter(options: {
  maxRequests: number;
  timeWindowMs: number;
}) {
  const requestCounts = new Map<string, { count: number; timestamp: number }>();

  return function (req: Request, res: Response, next: NextFunction) {
    console.log(res);
    const email = req.params.email || req.body.email || req.query.email;
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const now = Date.now();
    const entry = requestCounts.get(email);

    if (entry) {
      if (now - entry.timestamp < options.timeWindowMs) {
        if (entry.count >= options.maxRequests) {
          throw new HttpException(
            'Too many requests. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        } else {
          entry.count++;
        }
      } else {
        requestCounts.set(email, { count: 1, timestamp: now });
      }
    } else {
      requestCounts.set(email, { count: 1, timestamp: now });
    }

    next();
  };
}
