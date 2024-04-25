import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  ): Promise<EvalEntity[]> {
    return this.evalService.findAll(practiceId);
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
  ): Promise<EvalEntity> {
    return this.evalService.create({
      createEvalDto,
      practiceId,
    });
  }

  @Patch(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async update(
    @Body(new ValidationPipe()) createEvalDto: CreateEvalDto,
    @Param()
    { id }: { id: string },
  ): Promise<EvalEntity | null> {
    return this.evalService.update({
      createEvalDto,

      id,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.evalService.remove(id);
  }
}
