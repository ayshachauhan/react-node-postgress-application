import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@packages/entities/user';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EvalsModule } from 'src/evals/evals.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { S3Service } from './s3.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
  ],
  providers: [UsersService, practiceNotFoundInterceptor, S3Service],
  controllers: [UsersController],
  exports: [UsersService, S3Service],
})
export class UsersModule {}
