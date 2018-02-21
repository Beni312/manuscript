import { AcademicDiscipline } from './academic.discipline';
import { User } from './user';

export class Preload {
  user: User;
  academicDisciplines: AcademicDiscipline[];
  role: string;

  constructor(user: User, academicDisciplines: AcademicDiscipline[]) {
    this.user = user;
    this.academicDisciplines = academicDisciplines;
  }
}
