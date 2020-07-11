import { User } from '..';

export class UserManagementDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  status: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.userAlias.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role.name;
    this.email = user.email;
    this.status = user.status.status;
  }

}
