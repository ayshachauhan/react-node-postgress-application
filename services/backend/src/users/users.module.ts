import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticesModule } from 'src/practices/practices.module';
import { UserPracticesModule } from 'src/userPractices/userPractices.module';
import { User } from '../entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UserPracticesModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
