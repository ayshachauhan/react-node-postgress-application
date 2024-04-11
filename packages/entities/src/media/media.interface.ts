import { BaseEntity } from '../base.entity';

export interface IMedia extends BaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
}
