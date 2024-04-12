import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermissionEntity } from 'src/entities/userPermissions.entity';
import { User } from 'src/entities/users.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermissionEntity)
    private userPermissionRepository: Repository<UserPermissionEntity>,
    private readonly permissionService: PermissionsService,
  ) {}

  async remove(id: string): Promise<void> {
    await this.userPermissionRepository.softDelete({
      id,
    });
  }

  async create(
    { permissionId },
    userEntity: User,
  ): Promise<UserPermissionEntity> {
    const newUserPermission: UserPermissionEntity = new UserPermissionEntity();

    const permissionEntity =
      await this.permissionService.getPermissionById(permissionId);
    if (!permissionEntity) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }

    return await this.userPermissionRepository.save({
      ...newUserPermission,
      permission: permissionEntity,
      user: userEntity,
    });
  }

  async update({
    id,
    userId,
    permissionId,
  }): Promise<UserPermissionEntity | null> {
    const permissionEntity =
      await this.permissionService.getPermissionById(permissionId);
    if (!permissionEntity) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }

    await this.userPermissionRepository.update(id, {
      user: { id: userId },
      permission: { id: permissionId },
    });

    return await this.userPermissionRepository.findOne({
      where: { id, user: { id: userId }, permission: { id: permissionId } },
    });
  }
}
