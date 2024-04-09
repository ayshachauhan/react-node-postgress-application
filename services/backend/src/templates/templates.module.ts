import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundInterceptor } from 'src/NotFoundInterceptor';
import { TemplateEntity } from 'src/entities/templates.entity';
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
    NotFoundInterceptor,
    {
      provide: 'NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
  ],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
