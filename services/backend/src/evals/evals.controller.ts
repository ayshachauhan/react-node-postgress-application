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
import { EvalEntity } from '@packages/entities/eval';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEvalDto } from 'src/evals/dto/createEval.dto';
import { EvalsService } from 'src/evals/evals.service';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { UpdateEvalDto } from './dto/updateEval.dto';
import { AuthenticatedRequest } from './types';

@ApiTags('Evals')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/evals')
@UseGuards(AuthGuard)
export class EvalsController {
  constructor(private readonly evalService: EvalsService) {}

  @Get()
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(
    @Param() { practiceId }: { practiceId: string },
    @Query('includeDeleted') includeDeleted: boolean = false,
  ): Promise<EvalEntity[]> {
    return this.evalService.findAll(practiceId, includeDeleted);
  }

  @Get(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async getEvalById(@Param('id') id: string): Promise<EvalEntity | null> {
    return await this.evalService.getEvalById(id);
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Body(new ValidationPipe()) createEvalDto: CreateEvalDto,
    @Param() { practiceId }: { practiceId: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<EvalEntity> {
    return this.evalService.create({
      createEvalDto,
      practiceId,
      user: request.user,
    });
  }

  @Patch(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async update(
    @Body(new ValidationPipe()) createEvalDto: UpdateEvalDto,
    @Param()
    { id, practiceId }: { id: string; practiceId: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<EvalEntity | null> {
    return this.evalService.update({
      createEvalDto,
      id,
      user: request.user,
      practiceId,
    });
  }

  @Delete(':id')
  async remove(
    @Param()
    { id, practiceId }: { id: string; practiceId: string },
    @Req() request: AuthenticatedRequest,
    @Body(new ValidationPipe()) deleteEvalDto: { ipAddress: string },
  ): Promise<void> {
    return await this.evalService.remove({
      id,
      practiceId,
      ipAddress: deleteEvalDto.ipAddress,
      user: request.user,
    });
  }
}
