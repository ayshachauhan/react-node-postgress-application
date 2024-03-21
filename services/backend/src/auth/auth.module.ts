import { Module, forwardRef } from '@nestjs/common';
import { UserPracticesModule } from 'src/userPractices/userPractices.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => UserPracticesModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
