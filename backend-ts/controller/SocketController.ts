import { inject, injectable } from "inversify";
import { MessageDto } from "../model/dto/MessageDto";
import { MessageService } from "../service/MessageService";
import { SendMessageCommand } from "../model/command/SendMessageCommand";
import { Socket } from 'socket.io';
import { SocketService } from "../service/SocketService";
import { SignSeenMessageCommand } from "../model/command/SignSeenMessageCommand";
import { SignSeenMessageDto } from "../model/dto/SignSeenMessageDto";

@injectable()
export class SocketController {

  @inject(SocketService.name)
  private socketService: SocketService;

  @inject(MessageService.name)
  private messageService: MessageService;

  initSocketEndpoints(socket: Socket) {
    socket.on('sendMessage', (msg: SendMessageCommand) => {
      this.sendMessage(socket, msg);
    });

    socket.on('signSeenMessage', (msg: SignSeenMessageCommand) => {
      this.signSeenMessages(socket, msg);
    });
  }

  sendMessage(socket: Socket, msg: SendMessageCommand) {
    this.messageService.addMessage(socket.request.user.id, msg)
      .then((message) => {
        this.socketService.sendMessageBySocketId(socket.id, new MessageDto(message.to, message.message, message.creationDate, message.toUser === socket.request.user.id, message.isRead));
        this.socketService.sendMessageByUserId(msg.to, new MessageDto(socket.request.user.id, message.message, message.creationDate, true, message.isRead));
      })
      .catch(err => {
        this.socketService.handleError(socket, err);
      });
  }

  signSeenMessages(socket: Socket, msg: SignSeenMessageCommand) {
    this.messageService.signSeenMessage(socket.request.user.id, msg.to)
      .then(() => {
        this.socketService.sendSignSeenMessagesByUserId(msg.to, new SignSeenMessageDto(socket.request.user.id));
      })
      .catch((err) => {
        this.socketService.handleError(socket, err);
      });
  }
}
