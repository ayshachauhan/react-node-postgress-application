import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeHome } from '@packages/entities';
import { PracticesModule } from 'src/practices/practices.module';
import { PracticeHomesController } from './practiceHomes.controller';
import { PracticeHomesService } from './practiceHomes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeHome]), PracticesModule],
  providers: [PracticeHomesService],
  controllers: [PracticeHomesController],
})
export class PracticeHomesModule {}
