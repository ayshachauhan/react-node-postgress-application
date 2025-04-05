import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/check-email')
  async checkEmailExistence(
    @Query('email') email: string,
  ): Promise<{ exists: boolean }> {
    const user = await this.usersService.findUserByEmail(email);
    return { exists: !!user };
  }
}
