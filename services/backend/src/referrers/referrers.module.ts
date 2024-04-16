import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { Referrers } from '@packages/entities/referrer';
import { ReferrersController } from './referrers.controller';
import { ReferrersService } from './referrers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Referrers, PracticeEntity])],
  controllers: [ReferrersController],
  providers: [ReferrersService],
})
export class ReferrersModule {}
