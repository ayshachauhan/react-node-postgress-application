import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmailHandlerService } from './emailHandler.service';

@Controller('/practices/:practiceId/emailLog')
export class EmailHandlerController {
  constructor(private emailHandlerService: EmailHandlerService) {}
  @Get(':id')
  postUserReview(@Param('id') id: string, @Query('token') token: string) {
    return this.emailHandlerService.fetchAndMarkMailAsRead(id, token ?? '');
  }
}
