import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PermissionEntity } from '@packages/entities';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { SanitizedUser, SuperAdminUser } from './types';

@Injectable()
export class UserPermissionsGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!requiredPermission) {
      return false;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }

    try {
      const payload = await this.verify(token);
      request['user'] = payload;
      const userId = request['user']?.id;
      const userPermissions = await this.getUserPermissions(userId);

      if (!userPermissions) {
        return false;
      }

      return userPermissions.some(
        (permissionEntity: PermissionEntity) =>
          permissionEntity.name === requiredPermission,
      );
    } catch (error) {
      return false;
    }
  }

  async verify(token: string): Promise<SanitizedUser | SuperAdminUser> {
    return this.jwtService.verify(
      token,
      this.configService.get(ENVIRONMENT_VARIABLES.JWT_SECRET_KEY)!,
    );
  }

  private async getUserPermissions(
    userId: string,
  ): Promise<PermissionEntity[] | undefined> {
    const userInfo = await this.userService.getUserById(userId);
    return userInfo?.permissions;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring('Bearer '.length);
  }
}

export const Permission = (permission: string) =>
  SetMetadata('permission', permission);
