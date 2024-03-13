import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../entities/users.entity';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('practices/:practiceId/users')
@ApiBearerAuth('normal')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Param() { practiceId }: { practiceId: string },
  ) {
    return this.usersService.create(createUserDto, practiceId);
  }

  @Get()
  async getUsersByPractice(@Param('practiceId') practiceId: string) {
    return this.usersService.getUsersByPractice(practiceId);
  }

  @Get(':id')
  async getUserById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<User | null> {
    return this.usersService.getUserById(practiceId, id);
  }
}
