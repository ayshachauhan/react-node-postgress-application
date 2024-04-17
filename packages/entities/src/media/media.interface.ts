import { IBaseEntity } from '../base.interface';
import { ISurgeryType } from '../surgeryType';

export interface IMedia extends IBaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryType: ISurgeryType;
}
