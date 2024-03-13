import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateToken(request);
  }

  async validateToken(request: any): Promise<boolean> {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const payload = await this.verify(token);
      request['user'] = payload;
      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async verify(token: string) {
    return await jwt.verify(
      token,
      this.configService.get(ENVIRONMENT_VARIABLES.JWT_SECRET_KEY),
    );
  }

  extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring('Bearer '.length);
  }
}
