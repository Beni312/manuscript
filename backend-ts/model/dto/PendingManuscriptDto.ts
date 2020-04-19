export class PendingManuscriptDto {
  id: number;
  version: number;
  creationDate: Date;

  constructor(id: number, version: number, creationDate: Date) {
    this.id = id;
    this.version = version;
    this.creationDate = creationDate;
  }
}
