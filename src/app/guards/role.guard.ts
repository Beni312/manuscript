import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable()
export class RoleGuard implements CanActivateChild {

  constructor(private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let preload = UserService.getPreload();

    if (!preload) {
      this.router.navigate(['login']);
      return false;
    }

    if (childRoute.data.expectedRoles.includes(preload.user.role.toUpperCase())) {
      return true;
    }

    return false;
  }


}
