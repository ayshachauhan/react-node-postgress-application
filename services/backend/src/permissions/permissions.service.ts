import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '@packages/entities/permission';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async findAll(): Promise<PermissionEntity[]> {
    return await this.permissionRepository.find();
  }

  async getPermissionById(id: string): Promise<PermissionEntity | null> {
    return await this.permissionRepository.findOneBy({ id });
  }

  async getPermissionByIds(
    permissionIds: string[],
  ): Promise<PermissionEntity[] | null> {
    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });
    return permissions.length > 0 ? permissions : null;
  }
}
