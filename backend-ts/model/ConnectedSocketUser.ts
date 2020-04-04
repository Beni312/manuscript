import { UserInfo } from "./dto/UserInfo";

export class ConnectedSocketUser {
  socketId: string;
  userInfo: UserInfo;

  constructor(socketId: string, userInfo: UserInfo) {
    this.socketId = socketId;
    this.userInfo = userInfo;
  }
}
