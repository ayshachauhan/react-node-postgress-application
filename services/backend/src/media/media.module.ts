import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from '@packages/entities/media';
import { PracticeEntity } from '@packages/entities/practice';
import { SurgeryTypeEntity } from '@packages/entities/surgeryType';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoEntity, PracticeEntity, SurgeryTypeEntity]),
    PracticesModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, practiceNotFoundInterceptor],
})
export class MediaModule {}
