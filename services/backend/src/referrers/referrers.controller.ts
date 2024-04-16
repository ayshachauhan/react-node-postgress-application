import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  // Query, //commenting this code to be implemented in future
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateReferrerDto, updateReferrerDto } from './dtos/createReferrer';
import { ReferrersService } from './referrers.service';

@ApiTags('Referrers')
@ApiBearerAuth('normal')
@Controller('/practices/:practiceId/referrer')
@UseGuards(AuthGuard)
export class ReferrersController {
  constructor(private referrerService: ReferrersService) {}
  @Post()
  createReferrer(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) referrerData: CreateReferrerDto,
  ) {
    return this.referrerService.createReferrer(practiceId, referrerData);
  }
  @Delete('/:id')
  deleteReferrerById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
  ) {
    return this.referrerService.deleteReferrer(practiceId, id);
  }

  @Patch(':id')
  updateReferrerById(
    @Param('practiceId') practiceId: string,
    @Param('id') id: string,
    @Body(new ValidationPipe()) referrerData: updateReferrerDto,
  ) {
    return this.referrerService.updateReferrer(practiceId, id, referrerData);
  }

  @Get()
  getReferrer(
    @Param('practiceId') practiceId: string,
    /* commenting this code to be implemented in future
    @Query('limit') limit: string,
    @Query('page') page: string,
    */
  ) {
    // return this.referrerService.getReferrer(practiceId, page, limit); //commenting this code to be implemented in future
    return this.referrerService.getReferrer(practiceId);
  }
}
