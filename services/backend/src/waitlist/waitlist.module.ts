import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitlistEntity } from '@packages/entities';
import { practiceNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistEntity]), PracticesModule],
  providers: [WaitlistService, practiceNotFoundInterceptor],
  controllers: [WaitlistController],
  exports: [WaitlistService],
})
export class WaitlistModule {}
