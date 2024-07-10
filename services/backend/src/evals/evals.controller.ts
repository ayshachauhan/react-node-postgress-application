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
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { CreateEvalDto } from 'src/evals/dto/createEval.dto';
import { EvalsService } from 'src/evals/evals.service';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { ParseStringToBooleanPipe } from 'src/utils/pipes/stringToBoolean.pipes';
import { UpdateEvalDto } from './dto/updateEval.dto';
import { AuthenticatedRequest } from './types';

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
    @Query('includeDeleted', ParseStringToBooleanPipe)
    includeDeleted: boolean = false,
    @Query('doctorId') doctorId?: string,
  ): Promise<EvalEntity[]> {
    return this.evalService.findAll(practiceId, includeDeleted, doctorId);
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
    @Req() request: AuthenticatedRequest,
  ): Promise<EvalEntity> {
    return this.evalService.create({
      createEvalDto,
      practiceId,
      user: request.user,
    });
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.EDIT_CASE))
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
  @UseGuards(PermissionGuard(USER_PERMISSIONS.DELETE_CASE))
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
