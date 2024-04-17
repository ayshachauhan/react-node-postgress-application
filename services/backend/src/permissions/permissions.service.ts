import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '@packages/entities/permission';
import { Repository } from 'typeorm';

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
}
