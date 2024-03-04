import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
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
}
