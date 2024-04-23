import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './healthz/health.module';
import { createInfraModuleProviders } from './infra.module.provider';
import { InsuranceTypesModule } from './insuranceTypes/insuranceTypes.module';
import { MediaModule } from './media/media.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PracticeHomesModule } from './practiceHomes/practiceHomes.module';
import { PracticesModule } from './practices/practices.module';
import { ReferrersModule } from './referrers/referrers.module';
import { SurgeryTypesModule } from './surgeryTypes/surgeryTypes.module';
import { TemplatesModule } from './templates/templates.module';
import { UserPermissionsModule } from './userPermissions/userPermissions.module';
import { UsersModule } from './users/users.module';

/**
 * All the application related to app logic should be added here
 */
@Module({
  imports: [
    ...createInfraModuleProviders(),
    UsersModule,
    AuthModule,
    HealthModule,
    PracticesModule,
    PracticeHomesModule,
    MediaModule,
    PermissionsModule,
    UserPermissionsModule,
    ReferrersModule,
    TemplatesModule,
    SurgeryTypesModule,
    InsuranceTypesModule,
  ],
})
export class AppModule {}
