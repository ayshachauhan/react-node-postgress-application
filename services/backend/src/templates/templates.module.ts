import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from 'src/entities/templates.entity';
import { practiceNotFoundInterceptor } from 'src/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersModule } from 'src/users/users.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    PracticesModule,
    UsersModule,
  ],
  providers: [
    TemplatesService,
    practiceNotFoundInterceptor,
    {
      provide: 'NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
  ],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
