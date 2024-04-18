import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvalEntity } from '@packages/entities/eval';
import { EvalsController } from 'src/evals/evals.controller';
import { EvalsService } from 'src/evals/evals.service';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvalEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => InsuranceTypesModule),
  ],
  providers: [
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
    EvalsService,
  ],
  controllers: [EvalsController],
  exports: [EvalsService],
})
export class EvalsModule {}
