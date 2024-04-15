import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryTypeEntity } from '@packages/entities/surgeryType';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryTypesController } from './surgeryType.controller';
import { SurgeryTypesService } from './surgeryTypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurgeryTypeEntity]), PracticesModule],
  providers: [SurgeryTypesService],
  controllers: [SurgeryTypesController],
})
export class SurgeryTypesModule {}
