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
import { UserEntity } from '@packages/entities/*';
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
  async validateToken(@Req() request): Promise<UserEntity> {
    if (!request.user.isSuperAdmin) {
      await this.authService.setUserDetails(request.user);
    }

    const user = await this.authService.getUserById(request.user.id);
    return user ?? (request.user as UserEntity);
  }

  @Get('/resetLink/:email')
  async sendPasswordResetEmail(@Param('email') email: string): Promise<string> {
    await this.authService.sendPasswordResetEmail(email);
    return 'Mail sent Successfully';
  }
}
