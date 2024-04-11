import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities';
import { UserPracticesModule } from 'src/userPractices/userPractices.module';
import { UsersModule } from '../users/users.module';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeEntity]),
    forwardRef(() => UsersModule),
    forwardRef(() => UserPracticesModule),
  ],
  providers: [PracticesService],
  controllers: [PracticesController],
  exports: [PracticesService],
})
export class PracticesModule {}
