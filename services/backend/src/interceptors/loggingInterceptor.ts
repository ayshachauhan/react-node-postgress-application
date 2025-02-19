import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, catchError, tap, throwError } from 'rxjs';
import logger from 'src/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const requestId = randomUUID(); // Generate a unique request ID

    // Clone and filter sensitive data
    const filteredBody = { ...req.body };
    if (filteredBody.password) filteredBody.password = '******';
    if (filteredBody.token) filteredBody.token = '******';

    // Log request with requestId
    const requestLog = {
      requestId,
      timestamp: new Date().toISOString(),
      message: 'API Request',
      method: req.method,
      url: req.url,
      ip: req.ip,
      body: filteredBody,
      userAgent: req.headers['user-agent'],
    };

    logger.info(requestLog);

    const startTime = Date.now(); // Track execution time

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const httpContext = context.switchToHttp();
        const statusCode = httpContext.getResponse().statusCode;

        logger.info({
          requestId,
          timestamp: new Date().toISOString(),
          message: 'API Response',
          method: req.method,
          url: req.url,
          status: statusCode,
          responseTime: `${responseTime}ms`,
          statusMessage:
            statusCode >= 200 && statusCode < 300 ? '✅ Success' : '⚠️ Failed',
        });
      }),
      catchError((err) => {
        const httpContext = context.switchToHttp();
        const statusCode =
          httpContext.getResponse().statusCode || err.status || 500;

        logger.error({
          requestId,
          timestamp: new Date().toISOString(),
          message: 'API Error',
          method: req.method,
          url: req.url,
          status: statusCode,
          error: err.message,
          stack: err.stack,
        });

        return throwError(() => err);
      }),
    );
  }
}
