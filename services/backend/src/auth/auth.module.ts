import { Module, forwardRef } from '@nestjs/common';
import { TransporterModule } from '../transporter/transporter.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SamlAuthGuard } from './strategy/saml.guard';
import { SamlStrategy } from './strategy/saml.strategy';

@Module({
  imports: [forwardRef(() => UsersModule), TransporterModule],
  controllers: [AuthController],
  providers: [AuthService, SamlStrategy, SamlAuthGuard],
})
export class AuthModule {}
