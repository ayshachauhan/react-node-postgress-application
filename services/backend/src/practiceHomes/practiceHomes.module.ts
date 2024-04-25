import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeHomesEntity } from '@packages/entities/practiceHomes';
import { PracticeNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { PracticeHomesController } from './practiceHomes.controller';
import { PracticeHomesService } from './practiceHomes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeHomesEntity]), PracticesModule],
  providers: [PracticeHomesService, PracticeNotFoundInterceptor],
  controllers: [PracticeHomesController],
})
export class PracticeHomesModule {}
