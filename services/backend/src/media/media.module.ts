import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundInterceptor } from 'src/NotFoundInterceptor';
import { Video } from 'src/entities/media.entity';
import { PracticeEntity } from 'src/entities/practices.entity';
import { PracticesModule } from 'src/practices/practices.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, PracticeEntity]), PracticesModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    NotFoundInterceptor,
    {
      provide: 'NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
  ],
})
export class MediaModule {}
