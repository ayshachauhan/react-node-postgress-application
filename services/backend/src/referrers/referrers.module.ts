import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from 'src/entities/practices.entity';
import { Referrers } from 'src/entities/referrers.entity';
import { ReferrersController } from './referrers.controller';
import { ReferrersService } from './referrers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Referrers, PracticeEntity])],
  controllers: [ReferrersController],
  providers: [ReferrersService],
})
export class ReferrersModule {}
