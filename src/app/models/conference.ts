import { Author } from './author';
import { ConferenceSubmission } from './conference.submission';
import { AcademicDiscipline } from './academic.discipline';

export class Conference {
  title: string;
  description: string;
  submitter: Author;
  submissions: ConferenceSubmission[];
  academicDisciplines: AcademicDiscipline[];

  constructor(title: string, description: string, submitter: Author, submissions: ConferenceSubmission[], academicDisciplines: AcademicDiscipline[]) {
    this.title = title;
    this.description = description;
    this.submitter = submitter;
    this.submissions = submissions;
    this.academicDisciplines = academicDisciplines;
  }
}
