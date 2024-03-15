import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermissionEntity } from 'src/entities/userPermissions.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermissionEntity)
    private userPermissionRepository: Repository<UserPermissionEntity>,
    private readonly permissionService: PermissionsService,
    private readonly userService: UsersService,
  ) {}

  async remove(id: string): Promise<void> {
    await this.userPermissionRepository.softDelete({
      id,
    });
  }

  async create({
    userId,
    permissionId,
    practiceId,
  }): Promise<UserPermissionEntity> {
    const newUserPermission: UserPermissionEntity = new UserPermissionEntity();

    const userEntity = await this.userService.getUserById(practiceId, userId);
    if (!userEntity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

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
    practiceId,
    permissionId,
  }): Promise<UserPermissionEntity | null> {
    const userEntity = await this.userService.getUserById(practiceId, userId);
    if (!userEntity) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

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
