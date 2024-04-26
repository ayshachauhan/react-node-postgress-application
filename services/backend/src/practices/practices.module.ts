import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { TransporterModule } from '../transporter';
import { UsersModule } from '../users/users.module';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeEntity]),
    forwardRef(() => UsersModule),
    TransporterModule,
  ],
  providers: [PracticesService],
  controllers: [PracticesController],
  exports: [PracticesService],
})
export class PracticesModule {}
