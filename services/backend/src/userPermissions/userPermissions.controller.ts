import {
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPermissionEntity } from '@packages/entities/user';
import { AuthGuard } from '../auth/auth.guard';
import { UserNotFoundInterceptor } from '../interceptors/userNotFoundInterceptor';
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
  @UseInterceptors(UserNotFoundInterceptor)
  async create(
    @Req() request: Request,
    @Param() userPermissionCreateDto: UserPermissionCreateDto,
  ): Promise<UserPermissionEntity> {
    const userEntity = request['userEntity'];
    return this.userPermissionService.create(
      userPermissionCreateDto,
      userEntity,
    );
  }

  @Patch(':id')
  @UseInterceptors(UserNotFoundInterceptor)
  async update(
    @Param() userPermissionPatchDto: UserPermissionPatchDto,
  ): Promise<UserPermissionEntity | null> {
    return this.userPermissionService.update(userPermissionPatchDto);
  }
}
