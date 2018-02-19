import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class RoleGuard implements CanActivateChild {

  constructor(private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('role guard starting...');
    let preload = UserService.getUserInfo();
    console.log('Preload: ', preload);

    if (!preload) {
      this.router.navigate(['login']);
      return false;
    }

    if (childRoute.data.expectedRoles.includes(preload.role)) {
      return true;
    }

    return false;
  }


}
