import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SurgeryTypeEntity } from '@packages/entities';
import { PracticeGuard } from 'src/practices/practice.guard';
import { AuthGuard } from '../auth/auth.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import {
  CreateSurgeryTypeDto,
  UpdateSurgeryTypeDto,
} from './dto/createSurgery.dto';
import { SurgeryTypesService } from './surgeryTypes.service';

@ApiTags('SurgeryTypes')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/surgery-types')
@UseGuards(AuthGuard)
@UseInterceptors(practiceNotFoundInterceptor)
export class SurgeryTypesController {
  constructor(private readonly surgeryTypesService: SurgeryTypesService) {}

  @Get()
  @UseGuards(PracticeGuard)
  async getSurgeryTypeByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<SurgeryTypeEntity[]> {
    return this.surgeryTypesService.getSurgeryTypeByPractice(practiceId);
  }

  @Get(':id')
  @UseGuards(PracticeGuard)
  async getSurgeryTypeById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ): Promise<SurgeryTypeEntity | null> {
    console.log(id, '--id', practiceId, 'practiceid');
    return this.surgeryTypesService.getSurgeryTypeById(id, practiceId);
  }

  @Delete(':id')
  @UseGuards(PracticeGuard)
  async remove(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.surgeryTypesService.remove(id, practiceId);
  }

  @Post()
  @UseGuards(PracticeGuard)
  async create(
    @Req() request: Request,
    @Body(new ValidationPipe()) dto: CreateSurgeryTypeDto,
  ): Promise<SurgeryTypeEntity> {
    const practiceEntity = request['practiceEntity'];

    return this.surgeryTypesService.create(dto, practiceEntity);
  }

  @Patch(':id')
  @UseGuards(PracticeGuard)
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: UpdateSurgeryTypeDto,
  ): Promise<SurgeryTypeEntity | null> {
    return this.surgeryTypesService.update(dto, id);
  }
}
