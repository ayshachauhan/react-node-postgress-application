import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatbotLogsEntity, EmailLogEntity } from '@packages/entities';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { GetMessageParams } from 'src/messages/types';
import { AuthGuard } from '../auth/auth.guard';
import { MessagesService } from './messages.service';

type SmsLog =
  | (ChatbotLogsEntity & { type: 'chatbot' })
  | (EmailLogEntity & { type: 'sms' });

@UseInterceptors(practiceNotFoundInterceptor)
@ApiTags('Messages')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('search')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_MSG))
  async getPracticeHomesByPractice(
    @Param('practiceId') practiceId: string,
    @Query('searchMRNName') searchMRNName?: string,
  ): Promise<EmailLogEntity[]> {
    return this.messagesService.getMessagesByPractice(
      practiceId,
      searchMRNName,
    );
  }

  @Get('sms')
  async getSmsHistory(
    @Param('practiceId') practiceId: string,
    @Query() query: GetMessageParams,
  ): Promise<SmsLog[]> {
    return this.messagesService.getAllSmsLogs({
      practiceId: practiceId,
      patientId: query.patientId,
      mrn: query.mrn,
      email: query.email,
    });
  }
}
