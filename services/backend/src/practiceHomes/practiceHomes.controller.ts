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
import { PracticeHome } from '@packages/entities';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { AuthGuard } from '../auth/auth.guard';
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
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Req() request: Request,
    @Body(new ValidationPipe()) practiceHomeCreateDto: PracticeHomeCreateDto,
  ): Promise<PracticeHome> {
    const practiceEntity = request['practiceEntity'];
    return this.practiceHomesService.create(
      practiceHomeCreateDto,
      practiceEntity,
    );
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
