import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotLogsEntity } from '@packages/entities';
import { PatientsModule } from 'src/patients/patients.module';
import { AIController } from './ai.controller';
import { AIClientService } from './ai.service';
import { CustomGPTFactory } from './customGPT-factory';
import { OpenAIFactory } from './openAI-factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatbotLogsEntity]),
    forwardRef(() => PatientsModule),
  ],
  controllers: [AIController],
  providers: [OpenAIFactory, CustomGPTFactory, AIClientService],
  exports: [CustomGPTFactory, OpenAIFactory, AIClientService],
})
export class AIModule {}
