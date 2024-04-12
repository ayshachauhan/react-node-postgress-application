import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryTypeEntity } from 'src/entities/surgeryTypes.entity';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryTypesController } from './surgeryType.controller';
import { SurgeryTypesService } from './surgeryTypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurgeryTypeEntity]), PracticesModule],
  providers: [SurgeryTypesService],
  controllers: [SurgeryTypesController],
  exports: [SurgeryTypesService],
})
export class SurgeryTypesModule {}
