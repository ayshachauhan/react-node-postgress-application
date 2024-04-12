export interface MediaInterface {
  id?: string;
  name: string;
  urlEmbed: string;
  url: string;
  surgeryType: SurgeryType;
  practiceId: string;
  dateCreated?: Date;
  dateUpdated?: Date;
}

export interface SurgeryType {
  id: string;
  practiceId: string;
  name: string;
}

export interface MediaPostInterface {
  id?: string;
  name: string;
  urlEmbed: string;
  url: string;
  surgeryTypeId: string;
  practiceId: string;
  dateCreated?: Date;
  dateUpdated?: Date;
}
