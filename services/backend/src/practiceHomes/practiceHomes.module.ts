import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { PracticeHome } from '../entities/practiceHomes.entity';
import { PracticeHomesController } from './practiceHomes.controller';
import { PracticeHomesService } from './practiceHomes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeHome]), PracticesModule],
  providers: [
    PracticeHomesService,
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
  ],
  controllers: [PracticeHomesController],
  exports: [PracticeHomesService],
})
export class PracticeHomesModule {}
