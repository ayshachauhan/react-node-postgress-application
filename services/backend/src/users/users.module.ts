import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@packages/entities/user';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PracticesModule } from 'src/practices/practices.module';
import { PublicUsersController } from './public-users.controller';
import { S3Service } from './s3.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PermissionsModule),
  ],
  providers: [UsersService, practiceNotFoundInterceptor, S3Service],
  controllers: [UsersController, PublicUsersController],
  exports: [UsersService, S3Service],
})
export class UsersModule {}
