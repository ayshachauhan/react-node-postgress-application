import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { ReferrersEntity } from '@packages/entities/referrer';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { ReferrersController } from './referrers.controller';
import { ReferrersService } from './referrers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferrersEntity, PracticeEntity]),
    PracticesModule,
    SurgeryModule,
  ],
  controllers: [ReferrersController],
  providers: [ReferrersService, practiceNotFoundInterceptor],
  exports: [ReferrersService],
})
export class ReferrersModule {}
