import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { PracticesService } from '../practices/practices.service';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly practicesService: PracticesService,
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

    return await this.usersRepository.save({
      ...newUser,
      ...createUserDto,
      fullName,
      practice: { id: practiceEntity.id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    return existingUser ? existingUser : null;
  }

  async getUserById(practiceId: string, id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { practice: { id: practiceId }, id },
    });
  }

  async getUsersByPractice(practiceId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { practice: { id: practiceId } },
    });
  }
}
