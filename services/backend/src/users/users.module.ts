import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@packages/entities/user';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PermissionsModule),
  ],
  providers: [UsersService, practiceNotFoundInterceptor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
