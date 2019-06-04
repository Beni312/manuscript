import { AcademicDiscipline } from '..';
import { AuthorDto } from './AuthorDto';

export class UpsertSubmissionPreload {
  academicDisciplines: AcademicDiscipline[];
  authors: AuthorDto[];

  constructor(academicDisciplines: AcademicDiscipline[], authors: AuthorDto[]) {
    this.academicDisciplines = academicDisciplines;
    this.authors = authors;
  }
}
