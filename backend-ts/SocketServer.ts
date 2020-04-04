import * as SocketIO from 'socket.io';
import { Socket } from 'socket.io';
import 'reflect-metadata';

import { inject, injectable } from "inversify";
import { SocketService } from "./service/SocketService";
import { Authorize } from "./middleware/SocketAuthentication";
import { SocketController } from "./controller/SocketController";

@injectable()
export class SocketServer {

  @inject(SocketController.name)
  socketController: SocketController;

  @inject(SocketService.name)
  socketService: SocketService;

  init(serverInstance, container) {
    const io: SocketIO.Server = SocketIO(serverInstance);
    io.use(Authorize);
    this.socketService.init(io);

    io.on('connection', (socket: Socket) => {
      // container.get<SocketService>(SocketService.name).connectUser(socket.id, socket.request.user);
      this.socketService.connectUser(socket.id, socket.request.user);
      this.socketController.initSocketEndpoints(socket);

      // socket.on('addOrder', function (msg) {
      //   Server.container.get<AddNewOrderValidator>(AddNewOrderValidator.name).validate(socket, msg)
      //     .then(() => {
      //       Server.container.get<SocketController>(SocketController.name).addOrder(socket.request.user, msg);
      //     })
      //     .catch((err: BaseError) => Server.SocketErrorHandler(socket, err));
      // });

    });

    io.on('disconnect', (socket: Socket) => {
      this.socketService.disconnectUser(socket.request.user.id);
    });
  }
}
