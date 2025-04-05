import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.gaurd';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('normal')
@UseGuards(AuthGuard, RolesGuard)
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/check-email')
  async checkEmailExistence(
    @Query('email') email: string,
  ): Promise<{ exists: boolean; type?: string }> {
    const user = await this.usersService.findUserByEmail(email);
    return {
      exists: !!user,
      type: user?.type,
    };
  }
}
