import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router){
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (UserService.isLogined()) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
