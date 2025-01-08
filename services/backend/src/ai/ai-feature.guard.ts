import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AiFeatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log(context);
    const isFeatureEnabled = process.env.ENABLE_AI_CHAT === 'true';
    if (!isFeatureEnabled) {
      throw new ForbiddenException('AI Chat feature is disabled');
    }
    return true;
  }
}
