import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserPracticesService } from 'src/userPractices/userPractices.services';
import { In, Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { PracticesService } from '../practices/practices.service';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practicesService: PracticesService,
    @Inject(forwardRef(() => UserPracticesService))
    private readonly userPracticeService: UserPracticesService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    practiceId: string,
  ): Promise<User> {
    const newUser: User = new User();
    const { firstName, lastName } = createUserDto;

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const fullName = `${firstName} ${lastName}`;

    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }
    const resultUser = await this.usersRepository.save({
      ...newUser,
      ...createUserDto,
      fullName,
    });

    await this.userPracticeService.create({
      userId: resultUser.id,
      practiceId,
    });

    return resultUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    return existingUser ? existingUser : null;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async getUsersByPractice(practiceId: string): Promise<User[]> {
    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    const usersByPractice =
      await this.userPracticeService.getUsersByPractice(practiceId);

    return await this.usersRepository.find({
      where: { id: In(usersByPractice.map((ele) => ele.user.id)) },
    });
  }
}
