import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async validateToken(@Req() request): Promise<Record<string, string>> {
    if (!request.user.isSuperAdmin) {
      await this.authService.setUserPractices(request.user);
    }
    return request.user;
  }

  @Get('/resetLink/:email')
  async sendPasswordResetEmail(@Param('email') email: string): Promise<string> {
    await this.authService.sendPasswordResetEmail(email);
    return 'Mail sent Successfully';
  }
}
