import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router){
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (UserService.getUserInfo()) {
      console.log('Logged in, redirect to home');
      this.router.navigate(['']);
      return false;
    }

    console.log('You ere not logged in, redirect to login!');
    return true;
  }
}
