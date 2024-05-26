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
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { USER_PERMISSIONS } from 'src/enums/userPermissions.enums';
import { CreateEvalDto } from 'src/evals/dto/createEval.dto';
import { EvalsService } from 'src/evals/evals.service';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { UpdateEvalDto } from './dto/updateEval.dto';

@ApiTags('Evals')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/evals')
@UseGuards(AuthGuard)
export class EvalsController {
  constructor(private readonly evalService: EvalsService) {}

  @Get()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_NURTURE))
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(
    @Param() { practiceId }: { practiceId: string },
  ): Promise<EvalEntity[]> {
    return this.evalService.findAll(practiceId);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_NURTURE))
  @UseInterceptors(practiceNotFoundInterceptor)
  async getEvalById(@Param('id') id: string): Promise<EvalEntity | null> {
    return await this.evalService.getEvalById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.ADD_CASE))
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
    @Body(new ValidationPipe()) createEvalDto: UpdateEvalDto,
    @Param()
    { id }: { id: string },
  ): Promise<EvalEntity | null> {
    return this.evalService.update({
      createEvalDto,
      id,
    });
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.DELETE_CASE))
  async remove(@Param('id') id: string): Promise<void> {
    return await this.evalService.remove(id);
  }
}
