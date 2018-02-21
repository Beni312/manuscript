import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { SidebarItemDefinition } from '../../models/sidebar.item.definition';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ MenuService ]
})
export class UserComponent implements OnInit {

  public menuItems: SidebarItemDefinition[] = [];

  constructor(private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.menuItems = this.menuService.getSidebarItemsDefinitions();
  }
}
