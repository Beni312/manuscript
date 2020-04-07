import { inject, injectable } from 'inversify';
import { MessageRepository } from '../repository/MessageRepository';
import { UtilsService } from './UtilsService';
import { MessagePreload } from '../model/dto/MessagePreload';
import { MessageDto } from '../model/dto/MessageDto';
import { UserRepository } from '../repository/UserRepository';
import { AuthorDto } from '../model/dto/AuthorDto';
import { SendMessageCommand } from "../model/command/SendMessageCommand";
import { Message } from "../model/entity/Message";

@injectable()
export class MessageService {

  @inject(MessageRepository.name)
  messageRepository: MessageRepository;

  @inject(UtilsService.name)
  utilsService: UtilsService;

  @inject(UserRepository.name)
  userRepository: UserRepository;

  async findUserMessages(userId: number): Promise<MessagePreload> {
    const messages = await this.messageRepository.findUserMessages(userId);

    const mess: Map<number, Array<MessageDto>> = new Map();
    messages.forEach(m => {
      const to = m.to == userId ? m.userId : m.to;
      const stateInMap = mess.get(to);
      const messageDto = new MessageDto(to, m.message, m.creationDate, m.userId == userId, m.isRead);
      if (stateInMap) {
        stateInMap.push(messageDto);
      } else {
        mess.set(to, new Array<MessageDto>(messageDto));
      }
    });
    // const groupBy
    const grouped = this.utilsService.groupBy('to')(messages.map(m => new MessageDto(m.to === userId ? m.userId : m.to, m.message, m.creationDate, m.userId !== userId, m.isRead)));
    console.log(grouped);

    // let users: any[] = [];
    // if (Array.from(mess.keys()).length > 0) {
    //   users = await this.userRepository.findUsersByIds(Array.from(mess.keys()));
    // }
    const users = await this.userRepository.findUsers();

    return new MessagePreload(grouped, users.filter(u => u.id !== userId).map(u => new AuthorDto(u)));
  }

  addMessage(userId: number, sendMessageCommand: SendMessageCommand): Promise<Message> {
    return this.messageRepository.createNewMessage(userId, sendMessageCommand.to, sendMessageCommand.message);
  }

  signSeenMessage(userId: number, to: number) {
    return this.messageRepository.signMessages(userId, to);
  }

}
