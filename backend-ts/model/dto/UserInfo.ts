export class UserInfo {
  id: number;
  username: string;
  role: string;

  constructor(id: number, username: string, role: string) {
    this.id = id;
    this.username = username;
    this.role = role;
  }
}
