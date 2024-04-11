import { BaseEntity } from '../base.entity';
import { IPractice } from '../practice';

export interface IPracticeHomes extends BaseEntity {
  practice: IPractice;
  name: string;
}
