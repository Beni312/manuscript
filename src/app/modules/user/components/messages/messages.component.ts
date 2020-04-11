import { map, startWith } from "rxjs/operators";
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { getMessageState } from "../../../../store/message/MessageSelector";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Author } from '../../../../models/author';
import { ChatService } from '../../../../services/chat.service';
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Message } from "../../../../models/message";
import { MessageState } from "../../../../store/message/MessageReducer";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { SignMessageAsSeen } from '../../../../store/message/MessageActions';
import { SocketService } from "../../../../services/socket.service";

export class MessagePreload {
  messages: Map<number, Message[]>;
  users: Author[];

  constructor() {
    this.users = [];
  }
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @ViewChild('messageHistory') private myScrollContainer: ElementRef;

  messagePreload: MessagePreload = new MessagePreload();
  messages: Array<Message>;
  selectedAuthor: number;
  actualMessage: string;
  filteredOptions: Observable<Author[]>;
  searchAuthor = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private chatService: ChatService,
              private socketService: SocketService,
              private readonly store: Store<MessageState>) {
  }

  ngOnInit() {
    this.messagePreload = this.data.messagePreload;
    this.store.select(getMessageState).subscribe((state) => {
      this.messagePreload = state;
      if (this.selectedAuthor) {
        this.messages = state.messages[this.selectedAuthor];
        this.scrollDown();
      }
    });

    this.filteredOptions = this.searchAuthor.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  changeUserInputHandler(event: MatAutocompleteSelectedEvent) {
    this.changeUser(Number(event.option.id));
  }

  changeUser(userId: number) {
    this.selectedAuthor = userId;
    this.messages = this.messagePreload.messages[this.selectedAuthor];
    if (!this.messages) {
      this.messages = [];
    }

    this.signMessagesAsSeenToUser(userId);
    this.scrollDown();
  }

  signMessagesAsSeenToUser(userId: number) {
    const messagesToUser: Array<Message> = this.messagePreload.messages[userId];
    if (messagesToUser && messagesToUser.filter(m => m.incoming && !m.seen).length > 0) {
      this.socketService.markUserMessagesAsSeen({to: userId});
      this.store.dispatch(new SignMessageAsSeen(userId));
    }
  }

  scrollDown() {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, 1)
  }

  sendMessage() {
    if (!this.actualMessage || this.actualMessage.length === 0) {
      return;
    }
    this.socketService.sendMessage({message: this.actualMessage, to: this.selectedAuthor});
    this.actualMessage = '';
  }

  private _filter(value: string): Author[] {
    if (value.length < 2) {
      return [];
    }
    return this.messagePreload.users.filter(user => this.getFullName(user.firstName, user.lastName).toLowerCase().includes(value.toLowerCase()));
  }

  getFullName(firstName: string, lastName: string): string {
    return firstName + ' ' + lastName;
  }

  getFullNameByUserId(userId: number): string {
    const user = this.messagePreload.users.find(u => u.id === userId);
    return this.getFullName(user.firstName, user.lastName);
  }

  getLatestMessageDateByUserId(userId: number) {
    const messagesForUser: Message[] = this.messagePreload.messages[userId];
    return messagesForUser[messagesForUser.length - 1].sentDate;
  }

  getLatestMessageByUserId(userId: number) {
    const messagesForUser: Message[] = this.messagePreload.messages[userId];
    let message = messagesForUser[messagesForUser.length - 1].message;
    if (message && message.length > 23) {
      message = message.substring(0, 20) + '...';
    }
    return message;
  }

  getUserById(userId: number) {
    return this.messagePreload.users.find(u => u.id === userId);
  }

  getUsersFromMessages(): number[] {
    return Object.keys(this.messagePreload.messages).map(item => Number(item));
  }

  getUserMessageStyle(userId: number) {
    const mess: Array<Message> = this.messagePreload.messages[userId];
    if (mess.filter(m => m.incoming && !m.seen).length > 0) {
      return 'chat_list notSeenMessage';
    }
    return 'chat_list';
  }
}
