import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from 'src/entities/templates.entity';
import { PracticesModule } from 'src/practices/practices.module';
import { UsersModule } from 'src/users/users.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    PracticesModule,
    // forwardRef(() => PracticesModule),
    UsersModule,
    // forwardRef(() => SurgeryTypesModule),
  ],
  providers: [TemplatesService],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
