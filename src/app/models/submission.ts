import { AcademicDiscipline } from './academic.discipline';
import { Keyword } from './keyword';
import { Author } from './author';

export class Submission {
  id: number;
  title: string;
  creationDate: Date;
  lastModifyDate: Date;
  manuscriptAbstract: string;
  authors: Author[];
  keywords: Keyword[];
  academicDisciplines: AcademicDiscipline[];
  submitter: Author;
  conferenceId: number;

  constructor(id: number, title: string, creationDate: Date, lastModifyDate: Date, manuscriptAbstract: string, authors: Author[], keywords: Keyword[], academicDisciplines: AcademicDiscipline[], submitter: Author, conferenceId: number) {
    this.id = id;
    this.title = title;
    this.creationDate = creationDate;
    this.lastModifyDate = lastModifyDate;
    this.manuscriptAbstract = manuscriptAbstract;
    this.authors = authors;
    this.keywords = keywords;
    this.academicDisciplines = academicDisciplines;
    this.submitter = submitter;
    this.conferenceId = conferenceId;
  }
}
