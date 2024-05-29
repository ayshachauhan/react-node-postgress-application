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
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { SanitizedUser } from '../auth/types';
import { CreateSurgeryDto } from '../surgery/dto/createSurgery.dto';
import { UpdateSurgeryDto } from '../surgery/dto/updateSurgery.dto';
import { SurgeryService } from '../surgery/surgery.service';
import { QueryDto } from './dto/getSurgery.dto';

@ApiTags('Surgery')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/surgery')
@UseGuards(AuthGuard)
export class SurgeryController {
  constructor(private readonly surgeryService: SurgeryService) {}

  @Get()
  @UseInterceptors(practiceNotFoundInterceptor)
  async findAll(
    @Param() { practiceId }: { practiceId: string },
    @Query(new ValidationPipe()) { includeDeleted }: QueryDto,
  ): Promise<SurgeryEntity[]> {
    return this.surgeryService.findAll(practiceId, includeDeleted);
  }

  @Get('search')
  @UseInterceptors(practiceNotFoundInterceptor)
  async searchSurgeries(
    @Param() { practiceId }: { practiceId: string },
    @Query(new ValidationPipe()) { includeDeleted }: QueryDto,
    @Query('month') monthQueryParam: string,
    @Query('searchMRNName') searchMRNName?: string,
    @Query('option') option?: string,
    @Query('loggedInUserId') loggedInUserId?: string,
  ): Promise<SurgeryEntity[]> {
    let month: string[] = [];
    if (monthQueryParam && monthQueryParam.trim() !== '') {
      month = monthQueryParam.split(',');
    }
    const surgeries = await this.surgeryService.findSelected(
      practiceId,
      includeDeleted,
      month,
      searchMRNName,
      option,
      loggedInUserId,
    );
    return surgeries;
  }

  @Get(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async getEvalById(@Param('id') id: string): Promise<SurgeryEntity | null> {
    return await this.surgeryService.getSurgeryById(id);
  }

  @Post()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.ADD_CASE))
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
  @UseGuards(PermissionGuard(USER_PERMISSIONS.EDIT_CASE))
  @UseInterceptors(practiceNotFoundInterceptor)
  async update(
    @Body(new ValidationPipe()) createSurgeryDto: UpdateSurgeryDto,
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
  @UseGuards(PermissionGuard(USER_PERMISSIONS.DELETE_CASE))
  async remove(
    @Param()
    { id, practiceId }: { id: string; practiceId: string },
    @Req() request: Request & { user: SanitizedUser },
    @Body(new ValidationPipe()) deleteSurgeryDto: { ipAddress: string },
  ): Promise<void> {
    return await this.surgeryService.remove(
      id,
      practiceId,
      request,
      deleteSurgeryDto.ipAddress,
    );
  }
}
