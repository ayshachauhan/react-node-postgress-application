import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';
@Injectable()
export class PracticeGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const controller = context.getClass();
    const isAiController = controller.name === 'AIController';

    const practiceId = isAiController
      ? (request.query.practiceId as string)
      : request.params.practiceId;

    if (!practiceId) {
      throw new ForbiddenException('Practice ID is required.');
    }
    const currentUser = request.user;

    if (!currentUser) {
      throw new ForbiddenException('User not authenticated.');
    }

    const currentUserDetails = await this.usersService.getUserById(
      currentUser.id,
    );

    if (!currentUserDetails || !currentUserDetails.practices) {
      throw new ForbiddenException('User has no associated practices.');
    }

    const isAuthorizedPractice = currentUserDetails.practices.some(
      (practice) => practice.id === practiceId,
    );

    if (!isAuthorizedPractice) {
      throw new ForbiddenException(
        'You do not have permission to do any action in this practice.',
      );
    }

    return true;
  }
}
