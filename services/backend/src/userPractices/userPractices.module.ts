import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPracticeEntity } from 'src/entities/userPractices.entity';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersModule } from 'src/users/users.module';
import { UserPracticesService } from './userPractices.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPracticeEntity]),
    forwardRef(() => UsersModule),
    forwardRef(() => PracticesModule),
  ],
  providers: [UserPracticesService],
  exports: [UserPracticesService],
})
export class UserPracticesModule {}
