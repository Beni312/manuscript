import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Preload } from './preload.service';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(username: string, password: string) {
    return this.httpClient.post('/j_spring_security_check', {username: username, password: password})
      .subscribe((response: any) => {
        if (response.success) {
          this.loadUserInfoFromServer();
        } else {
          this.router.navigate(['login']);
        }
      });
  }

  loadUserInfoFromServer(): Promise<Preload> {
    return this.httpClient.post<Preload>('/application/preload', {})
      .toPromise()
      .then(resp => {
        console.log('Set currentUser: ' , resp);
        localStorage.setItem('currentUser', JSON.stringify(resp));
        this.router.navigate(['']);
        return resp;
      })
      .catch((error) => {
        console.log('unsuccessful preload: ', error);
        localStorage.removeItem('currentUser');
        return null;
      });
  }

  static getUserInfo(): Preload {
    console.log('getUserInfo: ', localStorage.getItem('currentUser'));
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
