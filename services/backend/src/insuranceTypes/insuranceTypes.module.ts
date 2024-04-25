import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceTypeEntity } from '@packages/entities/insuranceType';
import { PracticesModule } from '../practices/practices.module';
import { InsuranceTypesController } from './insuranceTypes.controller';
import { InsuranceTypesService } from './insuranceTypes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InsuranceTypeEntity]),
    forwardRef(() => PracticesModule),
  ],
  providers: [InsuranceTypesService],
  controllers: [InsuranceTypesController],
  exports: [InsuranceTypesService],
})
export class InsuranceTypesModule {}
