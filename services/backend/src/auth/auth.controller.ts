import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@packages/entities/*';
import express from 'express';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { SamlAuthGuard } from './strategy/saml.guard';
import { SamlStrategy } from './strategy/saml.strategy';
import { SanitizedUser } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
    private readonly samlStrategy: SamlStrategy,
  ) {}

  @Get('login/sso/metadata')
  async getSpMetadata(@Response() res: express.Response) {
    const ret = this.samlStrategy.generateServiceProviderMetadata(null, null);
    res.type('application/xml');
    res.send(ret);
  }

  @Get('login/sso')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    //this route is handled by passport-saml
    return;
  }

  @Post('login/sso/cb')
  @UseGuards(SamlAuthGuard)
  async samlAssertionConsumer(
    @Request() req: express.Request,
    @Response() res: express.Response,
  ) {
    //this routes gets executed on successful assertion from IdP
    if (req.user) {
      const user = req.user as SanitizedUser;
      const response = await this.authService.login(user);

      res.redirect(
        `${
          this.configService.get(ENVIRONMENT_VARIABLES.FRONT_END_BASE_URL) ?? ''
        }/sso?token=${response.access_token}`,
      );
    }
  }

  @Post('login')
  async login(@Body() { email, password }: LoginUserDto) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('normal')
  async validateToken(@Req() request): Promise<UserEntity> {
    let user;
    if (!request.user.isSuperAdmin) {
      user = await this.authService.setUserDetails(request.user);
    } else {
      user = request.user;
    }

    return user;
  }

  @Get('/resetLink/:email')
  async sendPasswordResetEmail(@Param('email') email: string): Promise<string> {
    await this.authService.sendPasswordResetEmail(email);
    return 'Mail sent Successfully';
  }
}
