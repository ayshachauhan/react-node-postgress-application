import {
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class userNotFoundInterceptor<T>
  implements NestInterceptor<T | T[], T | T[]>
{
  constructor(
    private readonly userService: UsersService,
    @Inject('USER_NOT_FOUND_MESSAGE') private readonly errorMessage: string,
  ) {}

  async intercept(
    context: ExecutionContext,
    next,
  ): Promise<Observable<T | T[]>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.userId;
    const userEntity = await this.userService.getUserById(userId);
    if (!userEntity) {
      throw new NotFoundException(this.errorMessage);
    }
    request.userEntity = userEntity;
    return next.handle();
  }
}
