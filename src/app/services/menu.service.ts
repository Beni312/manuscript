import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarItemDefinition } from '../models/sidebar.item.definition';
import { UserService } from './user.service';

@Injectable()
export class MenuService {

  constructor(private router: Router) {
  }

  getSidebarItemsDefinitions(): SidebarItemDefinition[] {
    const sidebarItemDefinitions: SidebarItemDefinition[] = [];
    const role = UserService.getPreload().role;
    this.router.config[0].children.forEach(item => {
      if (item.data && item.data.place === 'sidebar' && item.data.expectedRoles.includes(role.toUpperCase())) {
        sidebarItemDefinitions.push(new SidebarItemDefinition(item.path, item.data.label, item.component, item.data.icon));
      }
    });
    return sidebarItemDefinitions;
  }

}
