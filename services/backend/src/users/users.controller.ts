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
import { User } from '@packages/entities/user';
import { PracticeNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
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
  @UseInterceptors(PracticeNotFoundInterceptor)
  create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Param() { practiceId }: { practiceId: string },
  ): Promise<SanitizedUser> {
    return this.usersService.create(createUserDto, practiceId);
  }

  @Get()
  @UseInterceptors(PracticeNotFoundInterceptor)
  async getUsersByPractice(@Param('practiceId') practiceId: string) {
    return this.usersService.getUsersByPractice(practiceId);
  }

  @Get(':id')
  async getUserById(@Param() { id }: { id: string }): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @UseInterceptors(PracticeNotFoundInterceptor)
  async deleteUser(@Param() { id }: { id: string }): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  @Patch('change-password')
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    @Param('practiceId') practiceId: string,
  ) {
    return this.usersService.changePassword({ practiceId, changePasswordDto });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) patchUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, patchUserDto);
  }
}
