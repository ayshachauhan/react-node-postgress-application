import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthGuard } from './auth.guard';

@Injectable()
export class SuperAdminGuard extends AuthGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateToken(request);
  }

  async validateToken(request: Request): Promise<boolean> {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const payload = await this.verify(token);
      console.log('--------------------------->>>>>>>>>>>>>>>>>');
      console.log(payload);
      request['user'] = payload;
      return payload?.isSuperAdmin;
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
