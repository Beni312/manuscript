import { Password } from './password';
import { User } from './user';

export class RegisterUser {
  user: User;
  password: Password;
  academicDisciplines: number[];

  constructor(user: User, password: Password, academicDisciplines: number[]) {
    this.user = user;
    this.password = password;
    this.academicDisciplines = academicDisciplines;
  }
}
