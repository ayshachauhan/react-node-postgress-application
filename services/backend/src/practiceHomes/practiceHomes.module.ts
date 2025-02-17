import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeHomesEntity } from '@packages/entities/practiceHomes';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';

import { UsersModule } from 'src/users/users.module';
import { PracticeHomesController } from './practiceHomes.controller';
import { PracticeHomesService } from './practiceHomes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeHomesEntity]),
    PracticesModule,
    forwardRef(() => UsersModule),
  ],
  providers: [PracticeHomesService, practiceNotFoundInterceptor],
  controllers: [PracticeHomesController],
  exports: [PracticeHomesService],
})
export class PracticeHomesModule {}
