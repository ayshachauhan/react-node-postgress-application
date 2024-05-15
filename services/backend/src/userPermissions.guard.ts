import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEntity } from '@packages/entities';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserPermissionsGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!requiredPermission) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const { userId } = request.params;
    const userPermissions = await this.getUserPermissions(userId);

    if (!userPermissions) {
      return false;
    }

    return userPermissions.some(
      (permissionEntity: PermissionEntity) =>
        permissionEntity.name === requiredPermission,
    );
  }

  private async getUserPermissions(
    userId: string,
  ): Promise<PermissionEntity[] | undefined> {
    const userInfo = await this.userService.getUserById(userId);
    return userInfo?.permissions;
  }
}

export const Permission = (permission: string) =>
  SetMetadata('permission', permission);
