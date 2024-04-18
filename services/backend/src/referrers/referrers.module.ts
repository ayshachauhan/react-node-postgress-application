import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { Referrers } from '@packages/entities/referrer';
import { PracticeNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { ReferrersController } from './referrers.controller';
import { ReferrersService } from './referrers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Referrers, PracticeEntity]),
    PracticesModule,
  ],
  controllers: [ReferrersController],
  providers: [ReferrersService, PracticeNotFoundInterceptor],
})
export class ReferrersModule {}
