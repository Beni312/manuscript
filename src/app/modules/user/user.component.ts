import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarItemDefinition } from '../../models/sidebar.item.definition';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material';
import { MessagePreload, MessagesComponent } from './components/messages/messages.component';
import { ChatService } from '../../services/chat.service';
import { SocketService } from "../../services/socket.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ MenuService ]
})
export class UserComponent implements OnInit {

  public static currentPage: string;
  public menuItems: SidebarItemDefinition[] = [];
  private messagePreload: MessagePreload;

  constructor(private menuService: MenuService,
              private userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private chatService: ChatService,
              private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.socketService.initSocket();
    this.menuItems = this.menuService.getSidebarItemsDefinitions();
    this.chatService.findUserMessages().subscribe((resp: MessagePreload) => {
      this.messagePreload = resp;
    });
  }

  logout() {
    this.userService.logout();
  }

  showMessages() {
    const dialogRef = this.dialog.open(MessagesComponent, {
      autoFocus: true,
      data: {
        messagePreload: this.messagePreload
      }
    });
  }

  get currentPage() {
    return UserComponent.currentPage;
  }
}
