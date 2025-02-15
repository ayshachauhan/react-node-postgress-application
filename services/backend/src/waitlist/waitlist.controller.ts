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
import { WaitlistEntity } from '@packages/entities';
import { PracticeGuard } from 'src/practices/practice.guard';
import { AuthGuard } from '../auth/auth.guard';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { WaitlistCreateDto } from './dto/create.dto';
import { WaitlistPatchDto } from './dto/patch.dto';
import { WaitlistService } from './waitlist.service';

@ApiTags('Waitlist')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/waitlist')
@UseGuards(AuthGuard, PracticeGuard)
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Get()
  async getWaitlistByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<WaitlistEntity[]> {
    return this.waitlistService.getWaitlistByPractice(practiceId);
  }

  @Get(':id')
  async getWaitlistById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<WaitlistEntity | null> {
    return this.waitlistService.getWaitlistById(id, practiceId);
  }

  @Delete(':id')
  async remove(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<void> {
    return this.waitlistService.removeWaitlist(id, practiceId);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Req() request: Request,
    @Body(new ValidationPipe()) waitlistCreateDto: WaitlistCreateDto,
  ): Promise<WaitlistEntity> {
    const practiceEntity = request['practiceEntity'];
    return this.waitlistService.createWaitlist(
      waitlistCreateDto,
      practiceEntity,
    );
  }

  @Patch(':id')
  async update(
    @Param() { practiceId, id }: { practiceId: string; id: string },
    @Body() waitlistPatchDto: WaitlistPatchDto,
  ): Promise<WaitlistEntity | null> {
    return this.waitlistService.updateWaitlist(
      id,
      waitlistPatchDto,
      practiceId,
    );
  }
}
