import { IBaseEntity } from '../base.interface';

export interface IMedia extends IBaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
}
