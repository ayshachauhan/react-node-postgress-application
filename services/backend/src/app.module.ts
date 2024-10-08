import { Module } from '@nestjs/common';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { AIModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { EmailHandlerModule } from './emailHandler/emailHandler.module';
import { EvalsModule } from './evals/evals.module';
import { HealthModule } from './healthz/health.module';
import { HistoryModule } from './history/history.module';
import { createInfraModuleProviders } from './infra.module.provider';
import { InsuranceTypesModule } from './insuranceTypes/insuranceTypes.module';
import { MediaModule } from './media/media.module';
import { MessagesModule } from './messages/messages.module';
import { PatientsModule } from './patients/patients.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PracticeHomesModule } from './practiceHomes/practiceHomes.module';
import { PracticesModule } from './practices/practices.module';
import { ReferrersModule } from './referrers/referrers.module';
import { ReviewsModule } from './review/review.module';
import { SmsHandlerModule } from './smsHandler/smsHandler.module';
import { SurgeryModule } from './surgery/surgery.module';
import { SurgeryConfigurationsModule } from './surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from './surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from './templates/templates.module';
import { UsersModule } from './users/users.module';
import { WaitlistModule } from './waitlist/waitlist.module';

/**
 * All the application related to app logic should be added here
 */
@Module({
  imports: [
    ...createInfraModuleProviders(),
    UsersModule,
    AuthModule,
    HealthModule,
    PracticesModule,
    PracticeHomesModule,
    MediaModule,
    PermissionsModule,
    ReferrersModule,
    ReviewsModule,
    TemplatesModule,
    SurgeryTypesModule,
    InsuranceTypesModule,
    PatientsModule,
    EvalsModule,
    SurgeryModule,
    CalendarModule,
    SurgeryConfigurationsModule,
    HistoryModule,
    EmailHandlerModule,
    SchedulerModule,
    MessagesModule,
    WaitlistModule,
    AIModule,
    SmsHandlerModule,
  ],
})
export class AppModule {}
