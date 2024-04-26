import { PracticeEntity, UserEntity } from '@packages/entities/*';
import { Request } from 'express';

export type RequestWithData = Request & {
  data: {
    practice: PracticeEntity;
    user: UserEntity;
  };
};
