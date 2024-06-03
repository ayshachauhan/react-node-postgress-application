import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailLogEntity } from '@packages/entities/email_logs';
import { USER_PERMISSIONS } from '@packages/entities/permission';
import { PermissionGuard } from 'src/auth/userPermissions.guard';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { MessagesService } from './messages.service';

@UseInterceptors(practiceNotFoundInterceptor)
@ApiTags('Messages')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_MSG))
  async getPracticeHomesByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<EmailLogEntity[]> {
    return this.messagesService.getMessagesByPractice(practiceId);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(USER_PERMISSIONS.VIEW_MSG))
  async getPracticeHomeById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<EmailLogEntity | null> {
    return this.messagesService.getMessageById(id, practiceId);
  }
}
