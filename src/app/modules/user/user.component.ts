import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarItemDefinition } from '../../models/sidebar.item.definition';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ MenuService ]
})
export class UserComponent implements OnInit {

  public static currentPage: string;
  public menuItems: SidebarItemDefinition[] = [];

  constructor(private menuService: MenuService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.menuItems = this.menuService.getSidebarItemsDefinitions();
  }

  logout() {
    this.userService.logout();
  }

  get currentPage() {
    return UserComponent.currentPage;
  }
}
