import { AcademicDiscipline } from './academic.discipline';
import { Keyword } from './keyword';
import { Author } from './author';

export class Submission {
  id: string;
  title: string;
  creationDate: Date;
  lastModifyDate: Date;
  manuscriptAbstract: string;
  authors: Author[];
  keywords: Keyword[];
  academicDisciplines: AcademicDiscipline[];
  submitter: string;

  constructor(id: string, title: string, creationDate: Date, lastModifyDate: Date, manuscriptAbstract: string, authors: Author[], keywords: Keyword[], academicDisciplines: AcademicDiscipline[], submitter: string) {
    this.id = id;
    this.title = title;
    this.creationDate = creationDate;
    this.lastModifyDate = lastModifyDate;
    this.manuscriptAbstract = manuscriptAbstract;
    this.authors = authors;
    this.keywords = keywords;
    this.academicDisciplines = academicDisciplines;
    this.submitter = submitter;
  }
}
