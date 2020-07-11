import { User } from '..';

export class AuthorDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role.name;
  }
}
