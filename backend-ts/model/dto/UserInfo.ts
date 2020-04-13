export class UserInfo {
  id: number;
  username: string;
  role: string;
  avatar: boolean;

  constructor(id: number, username: string, role: string, avatar: boolean) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.avatar = avatar;
  }
}
