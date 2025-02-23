export interface CommonFields {
  createdBy: number;
  createdDate: Date;
  updatedBy: number | null;
  updatedDate: Date | null;
  deletedBy: number | null;
  deletedDate: Date | null;
  isDeleted: boolean;
}
