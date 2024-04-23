import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from '@packages/entities/template';
import { PracticeNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryTypesModule } from '../surgeryTypes/surgeryTypes.module';
import { UsersModule } from '../users/users.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    PracticesModule,
    UsersModule,
    SurgeryTypesModule,
  ],
  providers: [TemplatesService, PracticeNotFoundInterceptor],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
