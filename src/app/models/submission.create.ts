export class SubmissionCreate {
  title: string;
  manuscriptAbstract: string;
  conferenceId: number;
  authors: number[];
  keywords: string[];
  academicDisciplines: number[];

  constructor(title: string,
              manuscriptAbstract: string,
              conferenceId: number,
              authors: number[],
              keywords: string[],
              academicDisciplines: number[]) {
    this.title = title;
    this.manuscriptAbstract = manuscriptAbstract;
    this.conferenceId = conferenceId;
    this.authors = authors;
    this.keywords = keywords;
    this.academicDisciplines = academicDisciplines;
  }
}
