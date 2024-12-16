import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotLogsEntity, EmailLogEntity } from '@packages/entities';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { TransporterModule } from 'src/transporter';
import { PatientsModule } from '../patients/patients.module';
import { PracticesModule } from '../practices/practices.module';
import { UsersModule } from '../users/users.module';
import { AIController } from './ai.controller';
import { AIClientService } from './ai.service';
import { CustomGPTFactory } from './customGPT-factory';
import { OpenAIFactory } from './openAI-factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatbotLogsEntity, EmailLogEntity]),
    forwardRef(() => PatientsModule),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TransporterModule),
    forwardRef(() => EmailHandlerModule),
  ],
  controllers: [AIController],
  providers: [OpenAIFactory, CustomGPTFactory, AIClientService],
  exports: [CustomGPTFactory, OpenAIFactory, AIClientService],
})
export class AIModule {}
