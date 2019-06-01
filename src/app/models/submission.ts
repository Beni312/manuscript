import {AcademicDiscipline} from './academic.discipline';
import {Keyword} from './keyword';
import {Author} from './author';

export class Submission {
  id: number;
  title: string;
  manuscriptAbstract: string;
  submitter: Author;
  status: string;
  conferenceId: number;
  creationDate: Date;
  updatedOn: Date;
  authors: Author[];
  keywords: Keyword[];
  academicDisciplines: AcademicDiscipline[];

  constructor(id: number,
              title: string,
              creationDate: Date,
              updatedOn: Date,
              manuscriptAbstract: string,
              authors: Author[],
              keywords: Keyword[],
              academicDisciplines: AcademicDiscipline[],
              submitter: Author,
              conferenceId: number) {
    this.id = id;
    this.title = title;
    this.creationDate = creationDate;
    this.updatedOn = updatedOn;
    this.manuscriptAbstract = manuscriptAbstract;
    this.authors = authors;
    this.keywords = keywords;
    this.academicDisciplines = academicDisciplines;
    this.submitter = submitter;
    this.conferenceId = conferenceId;
  }
}
