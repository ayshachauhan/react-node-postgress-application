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
import { AuthGuard } from '../auth/auth.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import {
  AddBodyPartToSurgeryTypeDto,
  AddChecklistToSurgeryTypeDto,
  AddFacilityToSurgeryTypeDto,
  AddOptionToSurgeryTypeDto,
  CreateSurgeryTypeDto,
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
  async getSurgeryTypeByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<SurgeryTypeEntity[]> {
    return this.surgeryTypesService.getSurgeryTypeByPractice(practiceId);
  }

  @Get(':id')
  async getSurgeryTypeById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ): Promise<SurgeryTypeEntity | null> {
    return this.surgeryTypesService.getSurgeryTypeById(id, practiceId);
  }

  @Delete(':id')
  async remove(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.surgeryTypesService.remove(id, practiceId);
  }

  @Post()
  async create(
    @Req() request: Request,
    @Body(new ValidationPipe()) dto: CreateSurgeryTypeDto,
  ): Promise<SurgeryTypeEntity> {
    const practiceEntity = request['practiceEntity'];

    return this.surgeryTypesService.create(dto, practiceEntity);
  }

  @Patch(':id/facility')
  async addFacility(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: AddFacilityToSurgeryTypeDto,
  ): Promise<SurgeryTypeEntity | null> {
    return this.surgeryTypesService.addFacility(id, dto.name);
  }

  @Patch(':id/body-part')
  async addBodyPart(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: AddBodyPartToSurgeryTypeDto,
  ): Promise<SurgeryTypeEntity | null> {
    return this.surgeryTypesService.addBodyPart(id, dto.name);
  }

  @Patch(':id/check-list')
  async addSurgeryChecklist(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: AddChecklistToSurgeryTypeDto,
  ) {
    return this.surgeryTypesService.addChecklist(id, dto.checklist);
  }

  @Patch(':id/surgery-option')
  async addSurgeryOption(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: AddOptionToSurgeryTypeDto,
  ) {
    return this.surgeryTypesService.addSurgeryOption(id, dto.option);
  }
}
