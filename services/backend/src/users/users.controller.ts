import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  //UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity, UserType } from '@packages/entities/user';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
//import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { AuthGuard, RequestWithUser } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.gaurd';
import { checkFileType } from 'src/utils';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_BYTES } from 'src/utils/constants';
import { PracticeGuard } from '../practices/practice.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { SanitizedUser } from './types';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('practices/:practiceId/users')
@ApiBearerAuth('normal')
@UseGuards(AuthGuard, RolesGuard, PracticeGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(practiceNotFoundInterceptor)
  @Roles(UserType.ADMIN, UserType.DOCTOR)
  create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Param() { practiceId }: { practiceId: string },
  ): Promise<SanitizedUser> {
    return this.usersService.create(createUserDto, practiceId, true);
  }

  @Get()
  @UseInterceptors(practiceNotFoundInterceptor)
  async getUsersByPractice(@Param('practiceId') practiceId: string) {
    return this.usersService.getUsersByPractice(practiceId);
  }

  @Get(':id')
  async getUserById(
    @Param() { id }: { id: string },
  ): Promise<UserEntity | null> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @UseInterceptors(practiceNotFoundInterceptor)
  @Roles(UserType.ADMIN)
  async deleteUser(
    @Param() { id }: { id: string },
    @Req() request: RequestWithUser,
  ): Promise<void> {
    if (request.user.id === id) {
      throw new BadRequestException('Current loggedin user can not be deleted');
    }
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
  @Roles(UserType.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) patchUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, patchUserDto);
  }

  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImg(
    @Param() params: { id: string; practiceId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File size exceeds the limit of ${MAX_FILE_SIZE}MB.`,
      );
    }

    await checkFileType(file.buffer);

    return this.usersService.uploadUserImg({
      practiceId: params.practiceId,
      id: params.id,
      file,
    });
  }
}
