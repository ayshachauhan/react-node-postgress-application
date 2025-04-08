import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@packages/entities/*';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { SanitizedUser, SuperAdminUser } from './types';

export type RequestWithUser = Request & {
  user: UserEntity;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    return this.validateToken(request);
  }

  async validateToken(request: Request): Promise<boolean> {
    const { reqFromReset } = request.query;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const payload = await this.verify(token);
      console.log('---------------------------');
      console.log(payload);
      request['user'] = payload;
      return true;
    } catch (error) {
      console.log(error);
      if (reqFromReset) {
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
      } else {
        return false;
      }
    }
  }

  async verify(token: string): Promise<SanitizedUser | SuperAdminUser> {
    return this.jwtService.verify(
      token,
      this.configService.get(ENVIRONMENT_VARIABLES.JWT_SECRET_KEY)!,
    );
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring('Bearer '.length);
  }
}
