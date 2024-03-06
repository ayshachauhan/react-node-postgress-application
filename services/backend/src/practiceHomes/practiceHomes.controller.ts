import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PracticeHomesService } from './practiceHomes.service';
import { PracticeEntity } from '../entities/practices.entity';
import { PracticeHomePatchDto } from './dto/patch.dto';
import { PracticeHomeCreateDto } from './dto/create.dto';
import { PracticeHome } from 'src/entities/practiceHomes.entity';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('practices/:practiceId/homes')
@UseGuards(AuthGuard)
export class PracticeHomesController {
  constructor(private readonly practiceHomesService: PracticeHomesService) {}

  @Get()
  async getPracticeHomesByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<PracticeEntity[]> {
    return this.practiceHomesService.getPracticeHomesByPractice(practiceId);
  }

  @Get(':id')
  async getPracticeHomeById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<PracticeEntity | null> {
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
