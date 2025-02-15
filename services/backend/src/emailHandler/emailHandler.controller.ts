import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PracticeGuard } from 'src/practices/practice.guard';
import { EmailHandlerService } from './emailHandler.service';

@Controller('/practices/:practiceId/emailLog')
@UseGuards(PracticeGuard)
export class EmailHandlerController {
  constructor(private emailHandlerService: EmailHandlerService) {}
  @Get(':id')
  postUserReview(@Param('id') id: string, @Query('token') token: string) {
    return this.emailHandlerService.fetchAndMarkMailAsRead(id, token ?? '');
  }
}
