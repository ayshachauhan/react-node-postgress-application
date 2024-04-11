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
import { AuthGuard } from '../auth/auth.guard';
import { PracticeHome } from '../entities/practiceHomes.entity';
import { CreateSurgeryTypeDto } from './dto/createSurgery.dto';
import { SurgeryTypesService } from './surgeryTypes.service';

@ApiTags('SurgeryTypes')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/surgery-types')
@UseGuards(AuthGuard)
export class SurgeryTypesController {
  constructor(private readonly surgeryTypesService: SurgeryTypesService) {}

  @Get()
  async getSurgeryTypeByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<PracticeHome[]> {
    return this.surgeryTypesService.getSurgeryTypeByPractice(practiceId);
  }

  @Get(':id')
  async getSurgeryTypeById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<PracticeHome | null> {
    return this.surgeryTypesService.getSurgeryTypeById(id, practiceId);
  }

  @Delete(':id')
  async remove(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<void> {
    return this.surgeryTypesService.remove(id, practiceId);
  }

  @Post()
  async create(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) practiceHomeCreateDto: CreateSurgeryTypeDto,
  ): Promise<PracticeHome> {
    return this.surgeryTypesService.create(practiceHomeCreateDto, practiceId);
  }
}
