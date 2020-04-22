export class PendingManuscriptDto {
  id: number;
  version: number;
  filename: string;
  creationDate: Date;

  constructor(id: number, version: number, filename: string, creationDate: Date) {
    this.id = id;
    this.version = version;
    this.filename = filename;
    this.creationDate = creationDate;
  }
}
