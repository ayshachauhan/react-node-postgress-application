import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransporterModule } from '../transporter/transporter.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { createRateLimiter } from './rate-limiter.middleware';
import { SamlAuthGuard } from './strategy/saml.guard';
import { SamlStrategy } from './strategy/saml.strategy';

@Module({
  imports: [forwardRef(() => UsersModule), TransporterModule],
  controllers: [AuthController],
  providers: [AuthService, SamlStrategy, SamlAuthGuard],
})
export class AuthModule implements NestModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const resetConfig = this.configService.get('rateLimit.reset');
    const loginConfig = this.configService.get('rateLimit.login');

    consumer
      .apply(createRateLimiter(resetConfig))
      .forRoutes({ path: 'auth/resetLink/:email', method: RequestMethod.GET });

    consumer
      .apply(createRateLimiter(loginConfig))
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
