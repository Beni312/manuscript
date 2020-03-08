import { AcademicDisciplineDto } from './AcademicDisciplineDto';
import { AuthorDto } from './AuthorDto';
import { ConferenceSubmissionDto } from './ConferenceSubmissionDto';
import { UserDto } from './UserDto';

export class ConferenceDto {
  title: string;
  description: string;
  submitter: AuthorDto;
  authors: UserDto[];
  academicDisciplines: AcademicDisciplineDto[];
  submissions: ConferenceSubmissionDto[];

  constructor(title: string, description: string, submitter: AuthorDto, submissions: ConferenceSubmissionDto[], authors: UserDto[], academicDisciplines: AcademicDisciplineDto[]) {
    this.title = title;
    this.description = description;
    this.submitter = submitter;
    this.submissions = submissions;
    this.authors = authors;
    this.academicDisciplines = academicDisciplines;
  }
}
