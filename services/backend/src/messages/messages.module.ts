import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotLogsEntity, EmailLogEntity } from '@packages/entities';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { MediaModule } from 'src/media/media.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { TemplatesModule } from 'src/templates/templates.module';
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
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => MediaModule),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
