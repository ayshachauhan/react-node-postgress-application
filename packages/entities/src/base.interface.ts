export interface IBaseEntity {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateDeleted?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
