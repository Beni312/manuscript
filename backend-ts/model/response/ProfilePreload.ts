import { AcademicDisciplineDto } from "../dto/AcademicDisciplineDto";
import { UserDto } from "../dto/UserDto";
import { User } from "../index";

export class ProfilePreload {

  user: UserDto;
  academicDisciplines: AcademicDisciplineDto[];

  constructor(user: User) {
    this.user = new UserDto(user);
    this.academicDisciplines = user.academicDisciplines;
  }
}
