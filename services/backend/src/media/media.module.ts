import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entities/media.entity';
import { PracticeEntity } from 'src/entities/practices.entity';
import { practiceNotFoundInterceptor } from 'src/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, PracticeEntity]), PracticesModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    practiceNotFoundInterceptor,
    {
      provide: 'NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
  ],
})
export class MediaModule {}
