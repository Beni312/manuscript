import { AcademicDisciplineDto } from "./AcademicDisciplineDto";
import { UserDto } from "../../model/dto/UserDto";
import { User } from "../../model";

export class ProfilePreload {

  user: UserDto;
  academicDisciplines: AcademicDisciplineDto[];

  constructor(user: User) {
    this.user = new UserDto(user);
    this.academicDisciplines = user.academicDisciplines;
  }
}
