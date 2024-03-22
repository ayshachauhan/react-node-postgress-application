import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PracticeHome } from '../entities/practiceHomes.entity';
import { PracticeHomeCreateDto } from './dto/create.dto';
import { PracticeHomePatchDto } from './dto/patch.dto';
import { PracticeHomesService } from './practiceHomes.service';

@ApiTags('PracticeHomes')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/homes')
@UseGuards(AuthGuard)
export class PracticeHomesController {
  constructor(private readonly practiceHomesService: PracticeHomesService) {}

  @Get()
  async getPracticeHomesByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<PracticeHome[]> {
    return this.practiceHomesService.getPracticeHomesByPractice(practiceId);
  }

  @Get(':id')
  async getPracticeHomeById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<PracticeHome | null> {
    return this.practiceHomesService.getPracticeHomeById(id, practiceId);
  }

  @Delete(':id')
  async remove(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<void> {
    return this.practiceHomesService.remove(id, practiceId);
  }

  @Post()
  async create(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) practiceHomeCreateto: PracticeHomeCreateDto,
  ): Promise<PracticeHome> {
    return this.practiceHomesService.create(practiceHomeCreateto, practiceId);
  }

  @Patch(':id')
  async update(
    @Param() { practiceId, id }: { practiceId: string; id: string },
    @Body() practiceHomePatchDto: PracticeHomePatchDto,
  ): Promise<PracticeHome | null> {
    return this.practiceHomesService.update(
      id,
      practiceHomePatchDto,
      practiceId,
    );
  }
}
