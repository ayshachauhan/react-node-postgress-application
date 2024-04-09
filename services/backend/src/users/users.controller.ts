import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotFoundInterceptor } from 'src/NotFoundInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../entities/users.entity';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { SanitizedUser } from './types';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('practices/:practiceId/users')
@ApiBearerAuth('normal')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(NotFoundInterceptor)
  create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Param() { practiceId }: { practiceId: string },
  ): Promise<SanitizedUser> {
    return this.usersService.create(createUserDto, practiceId);
  }

  @Get()
  @UseInterceptors(NotFoundInterceptor)
  async getUsersByPractice(@Param('practiceId') practiceId: string) {
    return this.usersService.getUsersByPractice(practiceId);
  }

  @Get(':id')
  async getUserById(@Param() { id }: { id: string }): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @UseInterceptors(NotFoundInterceptor)
  async deleteUser(
    @Param() { id }: { id: string; practiceId: string },
  ): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) patchUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, patchUserDto);
  }
}
