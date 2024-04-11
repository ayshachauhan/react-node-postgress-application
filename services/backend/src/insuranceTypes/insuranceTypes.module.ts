import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceTypeEntity } from 'src/entities/insuranceTypes.entity';
import { PracticesModule } from 'src/practices/practices.module';
import { InsuranceTypesController } from './insuranceTypes.controller';
import { InsuranceTypesService } from './insuranceTypes.service';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceTypeEntity]), PracticesModule],
  providers: [InsuranceTypesService],
  controllers: [InsuranceTypesController],
})
export class InsuranceTypesModule {}
