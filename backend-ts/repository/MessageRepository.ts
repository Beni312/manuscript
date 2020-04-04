import { injectable } from 'inversify';
import { Op } from 'sequelize';
import { Message } from '../model/entity/Message';
import { Repository } from './Repository';

@injectable()
export class MessageRepository extends Repository<Message> {

  constructor() {
    super(Message);
  }

  findUserMessages(userId: number): Promise<Message[]> {
    return this.findAll({
      where: {
        [Op.or]: [
          {
            userId: userId
          },
          {
            to: userId
          }
        ]
      },
      order: [
        ['creationDate', 'ASC']
      ]
    });
  }

  createNewMessage(userId: number, to: number, message: string): Promise<Message> {
    return this.create({
      userId: userId,
      to: to,
      message: message
    })
  }

  signMessages(userId: number, to: number) {
    return this.model.update({
      isRead: true
    },{
      where: {
        userId: userId,
        to: to
      }
    })
  }
}
