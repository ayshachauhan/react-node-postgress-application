import { IEval } from '../eval/eval.interface';
import { ISurgery } from '../surgery/surgery.interface';
import { IBaseEntity } from '../base.interface';

export enum HistoryAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum HistoryType {
  SURGERY = 'surgery',
  EVAL = 'eval',
}

export type ChangedValue = {
  oldValue: string;
  newValue: string;
};

export type EntityChanges = Record<keyof ISurgery | keyof IEval, ChangedValue>;

export interface IHistory extends IBaseEntity {
  entityType: HistoryType;
  action: HistoryAction;
  entityId: string;
  changes?: EntityChanges;
}
