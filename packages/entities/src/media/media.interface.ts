import { BaseEntity } from '../base.entity';
import { SurgeryType } from '../template/template.interface';

export interface IMedia extends BaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryType: SurgeryType;
}
