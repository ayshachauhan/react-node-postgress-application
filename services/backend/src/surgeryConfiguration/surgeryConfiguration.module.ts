import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryConfigurationEntity } from '@packages/entities';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { surgeryTypeNotFoundInterceptor } from 'src/interceptors/surgeryTypeInterceptor';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryConfigurationsController } from './surgeryConfiguration.controller';
import { SurgeryConfigurationsService } from './surgeryConfiguration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurgeryConfigurationEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryTypesModule),
  ],
  providers: [
    SurgeryConfigurationsService,
    practiceNotFoundInterceptor,
    surgeryTypeNotFoundInterceptor,
  ],
  controllers: [SurgeryConfigurationsController],
  exports: [SurgeryConfigurationsService],
})
export class SurgeryConfigurationsModule {}
