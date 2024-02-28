import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeHomesController } from './practiceHomes.controller';
import { PracticeHome } from '../entities/practiceHomes.entity';
import { PracticeHomesService } from './practiceHomes.service';
import { PracticesModule } from 'src/practices/practices.module';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeHome]), PracticesModule],
  providers: [PracticeHomesService],
  controllers: [PracticeHomesController],
})
export class PracticeHomesModule {}
