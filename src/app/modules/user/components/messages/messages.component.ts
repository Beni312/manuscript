import { Component, Inject, OnInit } from '@angular/core';
import { Author } from '../../../../models/author';
import { ChatService } from '../../../../services/chat.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
// import { MAT_DIALOG_DATA } from '@angular/material';

export class MessagePreload {
  messages: Map<number, Message[]>;
  users: Author[];

  constructor() {
    this.messages = new Map<number, Message[]>();
    this.users = [];
  }
}

class Message {
  message: string;
  sentDate: Date;
  incoming: boolean;
  seen: boolean;

  constructor(message: string, sentDate: Date, incoming: boolean, seen: boolean) {
    this.message = message;
    this.sentDate = sentDate;
    this.incoming = incoming;
    this.seen = seen;
  }
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messagePreload: MessagePreload;
  // messages: Map<number, Message[]>;
  messages: Message[] = [];
  users: Author[];
  selectedAuthor: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private chatService: ChatService) {
  }

  ngOnInit() {
    this.messagePreload = this.data.messagePreload;
    // this.messagePreload = new MessagePreload();
    // const user1Messages = [];
    // user1Messages.push(new Message('test mesafginasdofnmasoefnas', new Date(), false, true));
    // user1Messages.push(new Message('test mesafginasdofnmaasdasdasdsoefnas', new Date(), true, true));
    // user1Messages.push(new Message('test mesafginasdofnmasoeasdasdfnas', new Date(), false, true));
    // user1Messages.push(new Message('test mesafginasdofnmasdasdwqwqwasoefnas', new Date(), false, true));
    // user1Messages.push(new Message('test mesafgisdfsdfsdfsdfsdffnasdofnmasoefnas', new Date(), false, true));
    //
    // this.messagePreload.messages.set(1, user1Messages);
    //
    // const user2Messages = [];
    // user2Messages.push(new Message('qweasdqweasd', new Date(), true, true));
    // user2Messages.push(new Message('qweasdqweasdas', new Date(), false, true));
    // user2Messages.push(new Message('tqweasdqweasdas', new Date(), true, true));
    // user2Messages.push(new Message('qweasdqweasdfnas', new Date(), false, true));
    // user2Messages.push(new Message('tqweasdqweasds', new Date(), false, true));
    //
    // this.messagePreload.messages.set(2, user2Messages);
    //
    // const user3Messages = [];
    // user3Messages.push(new Message('tasoefnas', new Date(), false, true));
    // user3Messages.push(new Message('tesdasdsoefnas', new Date(), true, true));
    // user3Messages.push(new Message('tesfnas', new Date(), false, true));
    // user3Messages.push(new Message('tesoefnas', new Date(), false, true));
    // user3Messages.push(new Message('tessoefnas', new Date(), false, true));
    //
    // this.messagePreload.messages.set(3, user3Messages);
    //
    // this.messagePreload.users.push(new Author(1, 'email', 'kovacs', 'lajos'));
    // this.messagePreload.users.push(new Author(2, 'email', 'Orbán', 'Viktor'));
    // this.messagePreload.users.push(new Author(3, 'email', 'Gyurcsány', 'Ferenc'));
    //
    // this.chatService.findUserMessages().subscribe((resp) => {
    //   console.log(resp);
    // });
  }

  changeUser(userId: number) {
    this.selectedAuthor = userId;
    this.messages = this.messagePreload.messages[userId];
    console.log(this.messagePreload);
    console.log(userId);
  }

}
