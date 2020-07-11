import { inject, injectable } from 'inversify';
import { MessageRepository } from '../repository/MessageRepository';
import { UtilsService } from './UtilsService';
import { MessageDto } from '../model/dto/MessageDto';
import { UserRepository } from '../repository/UserRepository';
import { SendMessageCommand } from '../model/command/SendMessageCommand';
import { Message } from '../model/entity/Message';

@injectable()
export class MessageService {

  @inject(MessageRepository.name)
  private messageRepository: MessageRepository;

  @inject(UtilsService.name)
  private utilsService: UtilsService;

  @inject(UserRepository.name)
  private userRepository: UserRepository;

  async findUserMessages(userId: number): Promise<Map<number, MessageDto[]>> {
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

    return this.utilsService.groupBy('to')(messages.map(m => new MessageDto(m.to === userId ? m.userId : m.to, m.message, m.creationDate, m.userId !== userId, m.isRead)));
  }

  addMessage(userId: number, sendMessageCommand: SendMessageCommand): Promise<Message> {
    return this.messageRepository.createNewMessage(userId, sendMessageCommand.to, sendMessageCommand.message);
  }

  signSeenMessage(userId: number, to: number) {
    return this.messageRepository.signMessages(to, userId);
  }
}
