import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceTypeEntity } from '@packages/entities/insuranceType';
import { PracticesModule } from '../practices/practices.module';
import { InsuranceTypesController } from './insuranceTypes.controller';
import { InsuranceTypesService } from './insuranceTypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceTypeEntity]), PracticesModule],
  providers: [InsuranceTypesService],
  controllers: [InsuranceTypesController],
})
export class InsuranceTypesModule {}
