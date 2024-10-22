import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import { SmsHandlerController } from './smsHandler.controller';
import { SmsHandlerService } from './smsHandler.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailLogEntity])],
  controllers: [SmsHandlerController],
  providers: [SmsHandlerService],
})
export class SmsHandlerModule {}
