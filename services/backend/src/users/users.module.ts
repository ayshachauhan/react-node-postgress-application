import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@packages/entities/user';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => PracticesModule),
  ],
  providers: [UsersService, practiceNotFoundInterceptor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
