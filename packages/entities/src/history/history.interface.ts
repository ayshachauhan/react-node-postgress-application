import { IBaseEntity } from '../base.interface';
import { IEval } from '../eval/eval.interface';
import { ISurgery } from '../surgery/surgery.interface';

export enum HistoryLogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum HistoryLogType {
  SURGERY = 'surgery',
  EVAL = 'eval',
}

export interface IHistory extends IBaseEntity {
  historyLogType: HistoryLogType;
  action: HistoryLogAction;
  surgery: ISurgery;
  eval: IEval;
  changes?: Record<string, unknown>;
}
