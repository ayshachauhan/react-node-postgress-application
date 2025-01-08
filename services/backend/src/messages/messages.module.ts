import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotLogsEntity, EmailLogEntity } from '@packages/entities';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { UsersModule } from 'src/users/users.module';
import { AIModule } from '../ai/ai.module';
import { PracticesModule } from '../practices/practices.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogEntity, ChatbotLogsEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EmailHandlerModule),
    forwardRef(() => AIModule),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
