import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Observable } from 'rxjs';

@Injectable()
export class SuperAdminGuard extends AuthGuard {
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
      return !!payload?.isSuperAdmin;
    } catch (error) {
      console.log(error);

      return false;
    }
  }
}
