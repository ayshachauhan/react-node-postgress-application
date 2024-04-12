import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@packages/entities/user';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { UserPracticesModule } from 'src/userPractices/userPractices.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UserPracticesModule),
  ],
  providers: [
    UsersService,
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
