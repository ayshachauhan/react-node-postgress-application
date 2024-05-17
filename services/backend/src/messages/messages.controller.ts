import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageEntity } from '@packages/entities/message';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { CreateMessageDto } from './dto/createMessage.dto';
import { MessagesService } from './messages.service';

@UseInterceptors(practiceNotFoundInterceptor)
@ApiTags('Messages')
@ApiBearerAuth('normal')
@Controller('practices/:practiceId/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getPracticeHomesByPractice(
    @Param('practiceId') practiceId: string,
  ): Promise<MessageEntity[]> {
    return this.messagesService.getMessagesByPractice(practiceId);
  }

  @Get(':id')
  async getPracticeHomeById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<MessageEntity | null> {
    return this.messagesService.getMessageById(id, practiceId);
  }

  @Delete(':id')
  async remove(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<void> {
    return this.messagesService.remove(id, practiceId);
  }

  @Post()
  async create(
    @Param('practiceId') practiceId: string,
    @Body(new ValidationPipe()) createMessageDto: CreateMessageDto,
  ): Promise<MessageEntity> {
    return this.messagesService.create(createMessageDto, practiceId);
  }
}
