import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticesModule } from 'src/practices/practices.module';
import { PracticeHome } from '../entities/practiceHomes/practiceHomes.entity';
import { PracticeHomesController } from './practiceHomes.controller';
import { PracticeHomesService } from './practiceHomes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeHome]), PracticesModule],
  providers: [PracticeHomesService],
  controllers: [PracticeHomesController],
})
export class PracticeHomesModule {}
