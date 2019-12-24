export class Preload {
  token: string;
  username: string;
  role: string;

  constructor(username: string, role: string, token: string) {
    this.username = username;
    this.role = role;
    this.token = token;
  }
}
