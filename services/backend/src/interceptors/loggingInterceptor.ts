import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import logger from 'src/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();

    logger.info({
      message: 'API Request',
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return next.handle().pipe(
      tap(() => {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const statusCode = httpContext.getResponse().statusCode;

        logger.info({
          message: 'API Response',
          method: request.method,
          url: request.url,
          status: statusCode,
          statusMessage:
            statusCode >= 200 && statusCode < 300 ? '✅ Success' : '⚠️ Failed',
        });
      }),
      catchError((err) => {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const statusCode =
          httpContext.getResponse().statusCode || err.status || 500;

        logger.error({
          message: 'API Error',
          method: request.method,
          url: request.url,
          status: statusCode,
          error: err.message,
        });

        return throwError(() => err);
      }),
    );
  }
}
