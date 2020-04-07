import * as SocketIO from 'socket.io';

import { injectable } from "inversify";
import { ConnectedSocketUser } from "../model/ConnectedSocketUser";
import { Socket } from 'socket.io';
import { UserInfo } from "../model/dto/UserInfo";
import { logger } from "./logger";
import { BaseError } from "../model/error/BaseError";
import { InternalServerError } from "../model/error/InternalServerError";

@injectable()
export class SocketService {

  private static connectedUsers: Map<number, ConnectedSocketUser> = new Map<number, ConnectedSocketUser>();

  private static io: SocketIO.Server;

  init(io: SocketIO.Server) {
    SocketService.io = io;
    // console.log(SocketService.io);
  }

  public connectUser(socketId: string, userInfo: UserInfo) {
    SocketService.connectedUsers.set(userInfo.id, new ConnectedSocketUser(socketId, userInfo));
  }

  public disconnectUser(userId: number) {
    SocketService.connectedUsers.delete(userId);
  }

  sendMessageByUserId(userId: number, message: any) {
    const connectedUser = this.getUserIfConnected(userId);
    if (!connectedUser) {
      return;
    }
    SocketService.io.to(connectedUser.socketId).emit('message', message);
  }

  sendMessageBySocketId(socketId: string, message: any) {
    SocketService.io.to(socketId).emit('message', message);
  }

  sendSignSeenMessages(socketId: string, message: any) {
    SocketService.io.to(socketId).emit('signSeenMessage', message);
  }

  sendSignSeenMessagesByUserId(userId: number, message: any) {
    const connectedUser = this.getUserIfConnected(userId);
    if (connectedUser) {
      SocketService.io.to(connectedUser.socketId).emit('signSeenMessage', message);
    }
  }

  public getUserIfConnected(userId: number): ConnectedSocketUser | undefined {
    return SocketService.connectedUsers.get(userId);
  }

  public getConnectedUser(userId: number) {
    return SocketService.connectedUsers.get(userId)
  }

  public handleError(socket: Socket, error: any) {
    logger.error(error.name + ' ' + error.message + ' ' + error.stack);
    if (error instanceof BaseError && !(error instanceof InternalServerError)) {
      this.sendError(socket.id, error.message);
    }

    this.sendError(socket.id, 'Internal server error')
  }

  sendError(socketId: string, message: any) {
    SocketService.io.to(socketId).emit('error', message);
  }
}
