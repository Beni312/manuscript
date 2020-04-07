import { map, startWith } from "rxjs/operators";
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Author } from '../../../../models/author';
import { ChatService } from '../../../../services/chat.service';
import { FormControl } from "@angular/forms";
import { Message } from "../../../../models/message";
import { MessageState } from "../../../../store/message/MessageReducer";
import { Store } from "@ngrx/store";
import { getMessageState } from "../../../../store/message/MessageSelector";
import { Observable } from "rxjs";
import { SocketService } from "../../../../services/socket.service";

// import { MAT_DIALOG_DATA } from '@angular/material';

export class MessagePreload {
  messages: Map<number, Message[]>;
  users: Author[];

  constructor() {
    // this.messages = new Map<number, Message[]>();
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
  // users: Author[] = [];
  selectedAuthor: number;
  actualMessage: string;
  searchedAuthor: string;
  filteredOptions: Observable<Author[]>;
  myControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private chatService: ChatService,
              private socketService: SocketService,
              private readonly store: Store<MessageState>) {
  }

  // ngAfterViewInit(): void {
  //   this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  // }

  ngOnInit() {
    this.messagePreload = this.data.messagePreload;
    this.store.select(getMessageState).subscribe((state) => {
      this.messagePreload = state;
      if (this.selectedAuthor) {
        this.messages = state.messages[this.selectedAuthor];
        this.scrollDown();
      }
      // this.messagePreload.users = state.users;
      // this.users = state.users;
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

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
    if (!this.messages) {
      this.messages = [];
    }
    // console.log(this.messagePreload);
    // console.log(userId);
    this.scrollDown();
  }

  scrollDown() {
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }, 1)
  }

  sendMessage() {
    this.socketService.sendMessage({message: this.actualMessage, to: this.selectedAuthor});
    this.actualMessage = '';
  }

  private _filter(value: string): Author[] {
    if (value.length < 3) {
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

  getUserById(userId: number) {
    return this.messagePreload.users.find(u => u.id === userId);
  }

  getUsersFromMessages(): number[] {
    return Object.keys(this.messagePreload.messages).map(item => Number(item));
  }
}
