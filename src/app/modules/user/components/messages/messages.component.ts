import { map, startWith } from 'rxjs/operators';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { getMessageState } from '../../../../store/message/MessageSelector';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Author } from '../../../../models/author';
import { ChatService } from '../../../../services/chat.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Message } from '../../../../models/message';
import { MessageState } from '../../../../store/message/MessageReducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SignMessageAsSeen } from '../../../../store/message/MessageActions';
import { SocketService } from '../../../../services/socket.service';
import { UserState } from '../../../../store/user/UserReducer';
import { getUsersState } from '../../../../store/user/UserSelector';

export class Messages {
  [k: string]: Array<Message>
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @ViewChild('messageHistory') private myScrollContainer: ElementRef;

  allMessages: Messages;
  actualMessages: Array<Message>;
  authors: Array<Author>;
  selectedAuthor: number;
  actualMessage: string;
  filteredOptions: Observable<Author[]>;
  searchAuthor = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private chatService: ChatService,
              private socketService: SocketService,
              private readonly messageStore: Store<MessageState>,
              private readonly userStore: Store<UserState>) {
  }

  ngOnInit() {
    this.messageStore.select(getMessageState).subscribe((state) => {
      this.allMessages = state.messages;
      if (this.selectedAuthor) {
        this.actualMessages = state.messages[this.selectedAuthor];
        this.scrollDown();
      }
    });

    this.userStore.select(getUsersState).subscribe((usersState) => {
      this.authors = usersState.users;
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
    this.actualMessages = this.allMessages[this.selectedAuthor];
    if (!this.actualMessages) {
      this.actualMessages = [];
    }

    this.signMessagesAsSeenToUser(userId);
    this.scrollDown();
  }

  signMessagesAsSeenToUser(userId: number) {
    const messagesToUser: Array<Message> = this.allMessages[userId];
    if (messagesToUser && messagesToUser.filter(m => m.incoming && !m.seen).length > 0) {
      this.socketService.markUserMessagesAsSeen({to: userId});
      this.messageStore.dispatch(new SignMessageAsSeen(userId));
    }
  }

  scrollDown() {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, 1);
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
    return this.authors.filter(user => this.getFullName(user.firstName, user.lastName).toLowerCase().includes(value.toLowerCase()));
  }

  getFullName(firstName: string, lastName: string): string {
    return firstName + ' ' + lastName;
  }

  getFullNameByUserId(userId: number): string {
    const user = this.authors.find(u => u.id === userId);
    return this.getFullName(user.firstName, user.lastName);
  }

  getLatestMessageDateByUserId(userId: number) {
    const messagesForUser: Message[] = this.allMessages[userId];
    return messagesForUser[messagesForUser.length - 1].sentDate;
  }

  getLatestMessageByUserId(userId: number) {
    const messagesForUser: Message[] = this.allMessages[userId];
    let message = messagesForUser[messagesForUser.length - 1].message;
    if (message && message.length > 23) {
      message = message.substring(0, 20) + '...';
    }
    return message;
  }

  getUserById(userId: number) {
    return this.authors.find(u => u.id === userId);
  }

  getUsersFromMessages(): number[] {
    return Object.keys(this.allMessages).map(item => Number(item));
  }

  getUserMessageStyle(userId: number) {
    const mess: Array<Message> = this.allMessages[userId];
    if (mess.filter(m => m.incoming && !m.seen).length > 0) {
      return 'chat_list notSeenMessage';
    }
    return 'chat_list';
  }
}
