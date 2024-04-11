import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionEntity } from '@packages/entities/user';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersModule } from 'src/users/users.module';
import { UserPermissionsController } from './userPermissions.controller';
import { UserPermissionsService } from './userPermissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermissionEntity]),
    forwardRef(() => UsersModule),
    PracticesModule,
    PermissionsModule,
  ],
  providers: [UserPermissionsService],
  controllers: [UserPermissionsController],
})
export class UserPermissionsModule {}
