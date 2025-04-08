import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PermissionEntity, UserEntity } from '@packages/entities/*';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { Request } from 'express';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { UsersService } from 'src/users/users.service';
import { SanitizedUser, SuperAdminUser } from './types';

export const PermissionGuard = (
  ...permissions: USER_PERMISSIONS[]
): Type<CanActivate> => {
  @Injectable()
  class PermissionGuard implements CanActivate {
    constructor(
      private readonly userService: UsersService,
      private configService: ConfigService,
      private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        return false;
      }

      try {
        const payload = await this.verify(token);
        console.log('-----------((((((((((((((((((');
        console.log(payload);
        request['user'] = payload;
        const userId = (request['user'] as SanitizedUser)?.id;
        console.log(userId, 'userid---');

        if (!userId) {
          return false;
        }

        const userInfo: UserEntity | null =
          await this.userService.getUserById(userId);

        if (!userInfo) {
          return false;
        }

        const userPermissions: PermissionEntity[] = userInfo.permissions || [];

        return permissions.some((permission) =>
          userPermissions.some(
            (userPermission) => userPermission.name === permission,
          ),
        );
      } catch (error) {
        console.error(error);
        return false;
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
  return PermissionGuard;
};
