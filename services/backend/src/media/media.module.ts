import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '@packages/entities/media';
import { PracticeEntity } from '@packages/entities/practice';
import { PracticeNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, PracticeEntity]), PracticesModule],
  controllers: [MediaController],
  providers: [MediaService, PracticeNotFoundInterceptor],
})
export class MediaModule {}
