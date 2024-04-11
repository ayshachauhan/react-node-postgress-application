import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '@packages/entities/media';
import { PracticeEntity } from '@packages/entities/practice';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, PracticeEntity])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
