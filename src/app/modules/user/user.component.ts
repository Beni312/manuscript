import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarItemDefinition } from '../../models/sidebar.item.definition';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Messages, MessagesComponent } from './components/messages/messages.component';
import { ChatService } from '../../services/chat.service';
import { SocketService } from '../../services/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MessageState } from '../../store/message/MessageReducer';
import { AddMessage, InitUserMessages } from '../../store/message/MessageActions';
import { Message } from '../../models/message';
import { UserState } from '../../store/user/UserReducer';
import { InitUsers } from '../../store/user/UserActions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ MenuService ]
})
export class UserComponent implements OnInit {

  public static currentPage: string;
  public menuItems: SidebarItemDefinition[] = [];

  constructor(private menuService: MenuService,
              private userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private chatService: ChatService,
              private socketService: SocketService,
              private readonly clientStore: Store<MessageState>,
              private readonly userStore: Store<UserState>) {
  }

  ngOnInit(): void {
    this.socketService.initSocket();
    this.menuItems = this.menuService.getSidebarItemsDefinitions();
    this.chatService.findUserMessages().subscribe((resp: Messages) => {
      this.clientStore.dispatch(new InitUserMessages(resp));
    });
    this.userService.getAuthors().subscribe(authors => {
      this.userStore.dispatch(new InitUsers({users: authors}));
    });
    this.socketService.onMessage().subscribe((resp: Message) => {
      this.clientStore.dispatch(new AddMessage(resp));
    });
  }

  logout() {
    this.userService.logout();
  }

  showMessages() {
    this.dialog.open(MessagesComponent, {
      autoFocus: false
    });
  }

  get currentPage() {
    return UserComponent.currentPage;
  }
}
