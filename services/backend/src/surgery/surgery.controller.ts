import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SurgeryEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { SanitizedUser } from '../auth/types';
import { CreateSurgeryDto } from './dto/createSurgery.dto';
import { SurgeryService } from './surgery.service';

@ApiTags('Surgery')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/surgery')
@UseGuards(AuthGuard)
export class SurgeryController {
  constructor(private readonly surgeryService: SurgeryService) {}

  @Get('')
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(
    @Param() { practiceId }: { practiceId: string },
    @Query('includeDeleted') includeDeleted: boolean = false,
  ): Promise<SurgeryEntity[]> {
    return this.surgeryService.findAll(practiceId, includeDeleted);
  }

  @Get(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async getEvalById(@Param('id') id: string): Promise<SurgeryEntity | null> {
    return await this.surgeryService.getSurgeryById(id);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Body(new ValidationPipe()) createSurgeryDto: CreateSurgeryDto,
    @Param() { practiceId }: { practiceId: string },
    @Req() request: Request & { user: SanitizedUser },
  ): Promise<SurgeryEntity> {
    return this.surgeryService.create(
      {
        createSurgeryDto,
        practiceId,
      },
      request,
    );
  }

  @Patch(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async update(
    @Body() createSurgeryDto: CreateSurgeryDto,
    @Param()
    { id, practiceId }: { id: string; practiceId: string },
    @Req() request: Request & { user: SanitizedUser },
  ): Promise<SurgeryEntity | null> {
    return this.surgeryService.update(
      {
        createSurgeryDto,
        id,
        practiceId,
      },
      request,
    );
  }

  @Delete(':id')
  async remove(
    @Param()
    { id, practiceId }: { id: string; practiceId: string },
    @Req() request: Request & { user: SanitizedUser },
  ): Promise<void> {
    console.log(request, 'requestobj');
    return await this.surgeryService.remove(id, practiceId, request);
  }
}
