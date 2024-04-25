import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { ReferrersEntity } from '@packages/entities/referrer';
import { PracticeNotFoundInterceptor } from '../interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { ReferrersController } from './referrers.controller';
import { ReferrersService } from './referrers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferrersEntity, PracticeEntity]),
    PracticesModule,
  ],
  controllers: [ReferrersController],
  providers: [ReferrersService, PracticeNotFoundInterceptor],
})
export class ReferrersModule {}
