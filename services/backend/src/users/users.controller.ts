import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { User } from 'src/entities/users.entity';

@Controller('practices/:practiceId/users')
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
    return await this.usersService.getUsersByPractice(practiceId);
  }

  @Get(':id')
  async getUserById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<User | null> {
    return await this.usersService.getUserById(practiceId, id);
  }
}
