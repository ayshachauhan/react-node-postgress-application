import { IBaseEntity } from '../base.interface';
import { SurgeryType } from '../template/template.interface';

export interface IMedia extends IBaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryType: SurgeryType;
}
