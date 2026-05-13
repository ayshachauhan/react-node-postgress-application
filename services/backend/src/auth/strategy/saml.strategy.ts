import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-saml';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { AuthService } from '../auth.service';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    const url = configService.get(
      ENVIRONMENT_VARIABLES.NEXT_PUBLIC_API_BASE_URL,
    );
    const issuer = configService.get(ENVIRONMENT_VARIABLES.SAML_ISSUER);
    const cert = configService.get(ENVIRONMENT_VARIABLES.SAML_CERT);
    const entryPoint = configService.get(ENVIRONMENT_VARIABLES.SAML_ENTRYPOINT);
    super({
      issuer,
      callbackUrl: `${url}/auth/login/sso/cb`,
      cert: cert || 'dummy-cert',
      entryPoint,
      wantAssertionsSigned: true,
      acceptedClockSkewMs: -1,
    });
  }

  async validate(profile: Profile) {
    try {
      const email = profile[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] as string;

      if (email) {
        const user = await this.authService.loginUsingEmail(email);
        return user;
      }

      throw new Error('email not found');
    } catch (e) {
      throw new ForbiddenException('invalid user attributes');
    }
  }
}
