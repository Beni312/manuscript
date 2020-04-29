import { AcademicDisciplineDto } from './AcademicDisciplineDto';
import { RoleDto } from './RoleDto';

export class SystemDataDto {
  academicDisciplines: Array<AcademicDisciplineDto>;
  roles: Array<RoleDto>;

  constructor(academicDisciplines: Array<AcademicDisciplineDto>, roles: Array<RoleDto>) {
    this.academicDisciplines = academicDisciplines;
    this.roles = roles;
  }
}
