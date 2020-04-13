export class ManuscriptDto {
  id: number;
  title: string;
  manuscriptAbstract: string;
  creationDate: Date;
  submissionId: number;

  constructor(id: number, title: string, manuscriptAbstract: string, creationDate: Date, submissionId: number) {
    this.id = id;
    this.title = title;
    this.manuscriptAbstract = manuscriptAbstract;
    this.creationDate = creationDate;
    this.submissionId = submissionId;
  }
}
