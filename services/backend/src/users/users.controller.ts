import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ValidationPipe,
  Get,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login.dto';
import { User } from 'src/entities/users.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('users/login')
  async login(
    @Body(new ValidationPipe())
    { email, password }: LoginUserDto,
  ) {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.usersService.login(user);
  }

  @Get('practices/:practiceId/users')
  async getUsersByPractice(@Param('practiceId') practiceId: string) {
    return await this.usersService.getUsersByPractice(practiceId);
  }

  @Get('practices/:practiceId/users/:id')
  async getUserById(
    @Param() { practiceId, id }: { practiceId: string; id: string },
  ): Promise<User | null> {
    return await this.usersService.findOne(practiceId, id);
  }
}
