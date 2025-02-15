import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InsuranceTypeEntity } from '@packages/entities/insuranceType';
import { PracticeGuard } from 'src/practices/practice.guard';
import { AuthGuard } from '../auth/auth.guard';
import { CreateInsuranceTypeDto } from './dto/createInsuranceType.dto';
import { InsuranceTypesService } from './insuranceTypes.service';

@ApiTags('InsuranceTypes')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/insurance-types')
@UseGuards(AuthGuard, PracticeGuard)
export class InsuranceTypesController {
  constructor(private readonly insuranceTypeService: InsuranceTypesService) {}

  @Get()
  async getPracticeHomesByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<InsuranceTypeEntity[]> {
    return this.insuranceTypeService.getInsuranceTypeByPractice(practiceId);
  }

  @Get(':id')
  async getPracticeHomeById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<InsuranceTypeEntity | null> {
    return this.insuranceTypeService.getInsuranceTypeById(id, practiceId);
  }

  @Delete(':id')
  async remove(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<void> {
    return this.insuranceTypeService.remove(id, practiceId);
  }

  @Post()
  async create(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) createInsuranceTypeDto: CreateInsuranceTypeDto,
  ): Promise<InsuranceTypeEntity> {
    return this.insuranceTypeService.create(createInsuranceTypeDto, practiceId);
  }
}
