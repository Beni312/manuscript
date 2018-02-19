import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preload } from '../models/preload';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(username: string, password: string) {
    return this.httpClient.post('/j_spring_security_check', {username: username, password: password})
      .subscribe((response: any) => {
        if (response.success) {
          this.preload();
        } else {
          this.router.navigate(['login']);
        }
      });
  }

  private preload(): Promise<Preload> {
    return this.httpClient.post<Preload>('/application/preload', {})
      .toPromise()
      .then(resp => {
        localStorage.setItem('currentUser', JSON.stringify(resp));
        this.router.navigate(['']);
        return resp;
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem('currentUser');
        return null;
      });
  }

  static getPreload(): Preload {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  static isLogined(): boolean {
    return localStorage.getItem('currentUser') != null;
  }
}
