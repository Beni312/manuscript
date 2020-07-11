import { AcademicDiscipline, Keyword, User } from '..';

export class EditSubmissionDto {

  id: number;
  title: string;
  manuscriptAbstract: string;
  authors: User[];
  academicDisciplines: AcademicDiscipline[];
  keywords: Keyword[];
}
