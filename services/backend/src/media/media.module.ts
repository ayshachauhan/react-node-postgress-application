import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '@packages/entities/media';
import { MediaConfigEntity } from '@packages/entities/mediaConfig';
import { PracticeEntity } from '@packages/entities/practice';
import { SurgeryConfigurationEntity } from '@packages/entities/surgeryConfiguration';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersModule } from 'src/users/users.module';
import { S3Service } from '../users/s3.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MediaEntity,
      PracticeEntity,
      SurgeryConfigurationEntity,
      MediaConfigEntity,
    ]),
    PracticesModule,
    UsersModule,
    forwardRef(() => EmailHandlerModule),
    forwardRef(() => PatientsModule),
  ],
  controllers: [MediaController],
  providers: [MediaService, practiceNotFoundInterceptor, S3Service],
})
export class MediaModule {}
