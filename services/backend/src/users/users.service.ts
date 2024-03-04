import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from './dto/create.dto';
import { PracticesService } from '../practices/practices.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private readonly practicesService: PracticesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const newUser: Users = new Users();
    const { firstName, lastName, practiceId } = createUserDto;

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

  async findUserByEmail(email: string): Promise<Users | null> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    return existingUser ? existingUser : null;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
