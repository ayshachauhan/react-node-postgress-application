import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryTypeEntity } from '@packages/entities/surgeryType';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryTypesController } from './surgeryType.controller';
import { SurgeryTypesService } from './surgeryTypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurgeryTypeEntity]), PracticesModule],
  providers: [SurgeryTypesService],
  controllers: [SurgeryTypesController],
  exports: [SurgeryTypesService],
})
export class SurgeryTypesModule {}
