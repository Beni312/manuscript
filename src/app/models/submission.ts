import { AcademicDiscipline } from './academic.discipline';
import { Author } from './author';
import { Keyword } from './keyword';

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
  canDelete: boolean;
  canEdit: boolean;
  canEvaluate: boolean;


  constructor() {
    this.title = '';
    this.manuscriptAbstract = '';
    this.submitter = new Author(null, '', '', '');
    this.authors = [];
    this.keywords = [];
    this.academicDisciplines = [];
  }
}
