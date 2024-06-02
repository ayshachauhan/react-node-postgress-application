import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from '@packages/entities/media';
import { PracticeEntity } from '@packages/entities/practice';
import { SurgeryConfigurationEntity } from '@packages/entities/surgeryConfiguration';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersModule } from 'src/users/users.module';
import { S3Service } from '../users/s3.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoEntity,
      PracticeEntity,
      SurgeryConfigurationEntity,
    ]),
    PracticesModule,
    UsersModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, practiceNotFoundInterceptor, S3Service],
})
export class MediaModule {}
