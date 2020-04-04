import { MessageDto } from './MessageDto';
import { AuthorDto } from './AuthorDto';

export class MessagePreload {

  messages: Map<number, MessageDto[]>;
  users: AuthorDto[];

  constructor(messages: Map<number, MessageDto[]>, users: AuthorDto[]) {
    this.messages = messages;
    this.users = users;
  }
}
