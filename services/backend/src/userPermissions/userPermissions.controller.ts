import {
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPermissionEntity } from 'src/entities/user/userPermission.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserPermissionCreateDto } from './dto/userPermission.createDto';
import { UserPermissionPatchDto } from './dto/userPermission.patchDto';
import { UserPermissionsService } from './userPermissions.service';

@ApiTags('UserPermissions')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/users/:userId/permissions/:permissionId')
@UseGuards(AuthGuard)
export class UserPermissionsController {
  constructor(private readonly userPermissionService: UserPermissionsService) {}

  @Delete(':id')
  async remove(@Param() { id }: { id: string }): Promise<void> {
    return this.userPermissionService.remove(id);
  }

  @Post()
  async create(
    @Param() userPermissionCreateDto: UserPermissionCreateDto,
  ): Promise<UserPermissionEntity> {
    return this.userPermissionService.create(userPermissionCreateDto);
  }

  @Patch(':id')
  async update(
    @Param() userPermissionPatchDto: UserPermissionPatchDto,
  ): Promise<UserPermissionEntity | null> {
    return this.userPermissionService.update(userPermissionPatchDto);
  }
}
