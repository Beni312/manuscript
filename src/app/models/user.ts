import { AcademicDiscipline } from './academic.discipline';

export class User {
  title: string;
  firstName: string;
  lastName: string;
  username: string;
  job: string;
  email: string;
  academicDisciplines: Array<AcademicDiscipline>;

  constructor(title: string, firstName: string, lastName: string, username: string, job: string, email: string) {
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.job = job;
    this.email = email;
  }
}
