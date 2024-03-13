import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { User } from '../entities/users.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
    return  this.usersService.getUsersByPractice(practiceId);
  }

  @Get(':id')
  async getUserById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<User | null> {
    return  this.usersService.getUserById(practiceId, id);
  }
}
