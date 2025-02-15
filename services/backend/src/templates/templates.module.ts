import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from '@packages/entities/template';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { S3Service } from 'src/users/s3.service';
import { UsersModule } from 'src/users/users.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    PracticesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => SurgeryConfigurationsModule),
  ],
  providers: [TemplatesService, practiceNotFoundInterceptor, S3Service],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
