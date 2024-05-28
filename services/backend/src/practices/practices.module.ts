import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeEntity } from '@packages/entities/practice';
import { TransporterModule } from '../transporter';
import { S3Service } from '../users/s3.service';
import { UsersModule } from '../users/users.module';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeEntity]),
    forwardRef(() => UsersModule),
    TransporterModule,
  ],
  providers: [PracticesService, S3Service],
  controllers: [PracticesController],
  exports: [PracticesService, S3Service],
})
export class PracticesModule {}
