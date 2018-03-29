export class Author {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;

  constructor(userId: string, email: string, firstName: string, lastName: string) {
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
