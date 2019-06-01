import { AcademicDiscipline, Submission } from '../index';

export class SubmissionPreload {
  submissions: Submission[];
  conferenceIdNamePairs: any;
  academicDisciplines: AcademicDiscipline[];

  constructor(submissions: Submission[], conferenceIdNamePairs: any, academicDisciplines: AcademicDiscipline[]) {
    this.submissions = submissions;
    this.conferenceIdNamePairs = conferenceIdNamePairs;
    this.academicDisciplines = academicDisciplines;
  }
}
