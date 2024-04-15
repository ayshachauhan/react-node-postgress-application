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
import { AuthGuard } from 'src/auth/auth.guard';
import { EvalEntity } from 'src/entities/eval.entity';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CreateEvalDto } from './dto/createEval.dto';
import { EvalsService } from './evals.service';

@ApiTags('Evals')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/evals')
@UseGuards(AuthGuard)
export class EvalsController {
  constructor(private readonly evalService: EvalsService) {}

  @Get()
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(): Promise<EvalEntity[]> {
    return this.evalService.findAll();
  }

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Body(new ValidationPipe()) createEvalDto: CreateEvalDto,
    @Param() { practiceId }: { practiceId: string; userId: string },
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
