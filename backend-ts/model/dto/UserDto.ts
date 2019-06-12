import { User } from "model";

export class UserDto {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  username: string;
  job: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.title = user.title;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.userAlias.username;
    this.job = user.job;
    this.email = user.email;
  }
}
