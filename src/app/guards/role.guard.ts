import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserComponent } from '../modules/user/user.component';
import { UserService } from '../services/user.service';

@Injectable()
export class RoleGuard implements CanActivateChild {

  constructor(private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const preload = UserService.getPreload();

    if (!preload) {
      this.router.navigate(['login']);
      return false;
    }

    if (!preload.role) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['login']);
      return false;
    }

    if (childRoute.data.expectedRoles.includes(preload.role.toUpperCase())) {
      UserComponent.currentPage = childRoute.data.label;
      return true;
    }

    return false;
  }


}
