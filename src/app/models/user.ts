export class User {
  title: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  job: string;
  email: string;

  constructor(title: string, firstName: string, lastName: string, username: string, role: string, job: string, email: string) {
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.role = role;
    this.job = job;
    this.email = email;
  }
}
