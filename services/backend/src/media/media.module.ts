import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entities/media.entity';
import { PracticeEntity } from 'src/entities/practices.entity';
import { SurgeryTypeEntity } from 'src/entities/surgeryTypes.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, PracticeEntity, SurgeryTypeEntity]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
