import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceTypeEntity } from '@packages/entities/insuranceType';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { MediaModule } from 'src/media/media.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { PracticesModule } from '../practices/practices.module';
import { InsuranceTypesController } from './insuranceTypes.controller';
import { InsuranceTypesService } from './insuranceTypes.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([InsuranceTypeEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => MediaModule),
  ],
  providers: [InsuranceTypesService],
  controllers: [InsuranceTypesController],
  exports: [InsuranceTypesService],
})
export class InsuranceTypesModule {}
