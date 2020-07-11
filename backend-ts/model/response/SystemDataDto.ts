import { AcademicDisciplineDto } from '../dto/AcademicDisciplineDto';
import { RoleDto } from '../dto/RoleDto';

export class SystemDataDto {
  academicDisciplines: Array<AcademicDisciplineDto>;
  roles: Array<RoleDto>;

  constructor(academicDisciplines: Array<AcademicDisciplineDto>, roles: Array<RoleDto>) {
    this.academicDisciplines = academicDisciplines;
    this.roles = roles;
  }
}
