import { IMedia } from '@packages/entities';

export type IMediaDTO = Pick<
  IMedia,
  'name' | 'url' | 'urlEmbed' | 'practiceId' | 'surgeryType'
>;
