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
import { SurgeryConfigurationEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { surgeryTypeNotFoundInterceptor } from 'src/interceptors/surgeryTypeInterceptor';
import { SurgeryConfigurationsService } from 'src/surgeryConfiguration/surgeryConfiguration.service';
import {
  AddSurgeryConfigurationDto,
  UpdateSurgeryConfigurationDto,
} from './dto/createSurgery.dto';

@ApiTags('SurgeryTypes')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/surgeryTypes/configurations')
@UseGuards(AuthGuard)
@UseInterceptors(practiceNotFoundInterceptor)
export class SurgeryConfigurationsController {
  constructor(
    private readonly surgeryConfigurationService: SurgeryConfigurationsService,
  ) {}

  @Get()
  async getSurgeryConfigurationBySurgeryType(
    @Param('practiceId') practiceId: string,
  ): Promise<SurgeryConfigurationEntity[]> {
    return this.surgeryConfigurationService.getSurgeryConfigurationByPractice(
      practiceId,
    );
  }

  @Get(':surgeryTypeId/:id')
  @UseInterceptors(surgeryTypeNotFoundInterceptor)
  async getSurgeryTypeById(
    @Param('surgeryTypeId') surgeryTypeId: string,
    @Param('id') id: string,
  ): Promise<SurgeryConfigurationEntity | null> {
    return this.surgeryConfigurationService.getSurgeryConfigurationById(
      id,
      surgeryTypeId,
    );
  }

  @UseInterceptors(surgeryTypeNotFoundInterceptor)
  @Delete(':surgeryTypeId/:id')
  async remove(
    @Param('surgeryTypeId') surgeryTypeId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.surgeryConfigurationService.remove(id, surgeryTypeId);
  }

  @Post(':surgeryTypeId')
  @UseInterceptors(surgeryTypeNotFoundInterceptor)
  async create(
    @Req() request: Request,
    @Body(new ValidationPipe()) dto: AddSurgeryConfigurationDto,
  ): Promise<SurgeryConfigurationEntity> {
    const surgeryTypeEntity = request['surgeryTypeEntity'];

    return this.surgeryConfigurationService.create(dto, surgeryTypeEntity);
  }

  @Patch(':surgeryTypeId/:id')
  @UseInterceptors(surgeryTypeNotFoundInterceptor)
  async update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body(new ValidationPipe()) dto: UpdateSurgeryConfigurationDto,
  ): Promise<SurgeryConfigurationEntity | null> {
    const surgeryTypeEntity = request['surgeryTypeEntity'];

    return this.surgeryConfigurationService.update(id, dto, surgeryTypeEntity);
  }
}
