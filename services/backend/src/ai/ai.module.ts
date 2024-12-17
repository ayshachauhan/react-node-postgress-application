import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotLogsEntity } from '@packages/entities';
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
    TypeOrmModule.forFeature([ChatbotLogsEntity]),
    forwardRef(() => PatientsModule),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TransporterModule),
  ],
  controllers: [AIController],
  providers: [OpenAIFactory, CustomGPTFactory, AIClientService],
  exports: [CustomGPTFactory, OpenAIFactory, AIClientService],
})
export class AIModule {}
