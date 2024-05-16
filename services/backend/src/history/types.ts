import { EntityChanges, HistoryAction, HistoryType } from '@packages/entities';

export type GetHistoryParams = {
  practiceId: string;
  userId: string;
};

export type GetHistoryByIdParams = GetHistoryParams & { id: string };

export type CreateHistoryParams = {
  entityId: string;
  entityType: HistoryType;
  action: HistoryAction;
  changes?: EntityChanges;
  ipAddress?: string;
} & Required<GetHistoryParams>;
