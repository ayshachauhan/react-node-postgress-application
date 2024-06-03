import { IEval } from '../eval/eval.interface';
import { IEmailLog } from '../index.browser';

export interface IEvalEmail {
  eval: IEval;
  emailLog: IEmailLog;
}
