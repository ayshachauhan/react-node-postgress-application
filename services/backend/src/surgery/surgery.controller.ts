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
import { SurgeryEntity } from '@packages/entities';
import { AuthGuard } from 'src/auth/auth.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { CreateSurgeryDto } from 'src/surgery/dto/createSurgery.dto';
import { UpdateSurgeryDto } from 'src/surgery/dto/updateSurgery.dto';
import { SurgeryService } from 'src/surgery/surgery.service';
import { Permission, UserPermissionsGuard } from 'src/userPermissions.guard';

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
  ): Promise<SurgeryEntity[]> {
    return this.surgeryService.findAll(practiceId);
  }

  @Get(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async getEvalById(@Param('id') id: string): Promise<SurgeryEntity | null> {
    return await this.surgeryService.getSurgeryById(id);
  }

  @Post()
  @UseGuards(UserPermissionsGuard)
  @Permission('add_case')
  @UseInterceptors(practiceNotFoundInterceptor)
  async create(
    @Body(new ValidationPipe()) createSurgeryDto: CreateSurgeryDto,
    @Param() { practiceId }: { practiceId: string },
  ): Promise<SurgeryEntity> {
    return this.surgeryService.create({
      createSurgeryDto,
      practiceId,
    });
  }

  @Patch(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  async update(
    @Body(new ValidationPipe()) createSurgeryDto: UpdateSurgeryDto,
    @Param()
    { id, practiceId }: { id: string; practiceId: string },
  ): Promise<SurgeryEntity | null> {
    return this.surgeryService.update({
      createSurgeryDto,

      id,
      practiceId,
    });
  }

  @Delete(':id')
  @UseGuards(UserPermissionsGuard)
  @Permission('delete_case')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.surgeryService.remove(id);
  }
}
