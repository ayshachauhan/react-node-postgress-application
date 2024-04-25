import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionEntity } from '@packages/entities/user';
import { UserNotFoundInterceptor } from '../interceptors/userNotFoundInterceptor';
import { PermissionsModule } from '../permissions/permissions.module';
import { PracticesModule } from '../practices/practices.module';
import { UsersModule } from '../users/users.module';
import { UserPermissionsController } from './userPermissions.controller';
import { UserPermissionsService } from './userPermissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermissionEntity]),
    forwardRef(() => UsersModule),
    PracticesModule,
    PermissionsModule,
  ],
  providers: [UserPermissionsService, UserNotFoundInterceptor],
  controllers: [UserPermissionsController],
})
export class UserPermissionsModule {}
