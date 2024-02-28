import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Video } from 'src/entities/media.enitity';
import { PracticeEntity } from 'src/entities/practices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, PracticeEntity])],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
