import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatientEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsService } from 'src/patients/patients.service';
import { PracticeGuard } from 'src/practices/practice.guard';

@ApiTags('Patients')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/patients')
@UseGuards(AuthGuard)
export class PatientsController {
  constructor(private readonly patientService: PatientsService) {}

  @Get()
  @UseGuards(PracticeGuard)
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(
    @Param() { practiceId }: { practiceId: string },
  ): Promise<PatientEntity[]> {
    return this.patientService.getPatientsByPractice(practiceId);
  }
}
