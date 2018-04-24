import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preload } from '../models/preload';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(username, password) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.httpClient.post('/j_spring_security_check',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        withCredentials: true
      }
    ).subscribe((response: any) => {
      if (response.success) {
        this.preload();
      } else {
        this.router.navigate(['login']);
      }
    });
  }

  private preload(): Promise<Preload> {
    return this.httpClient.post<Preload>('/application/preload', {}, {withCredentials: true})
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

  logout() {
    localStorage.removeItem('currentUser');
    this.httpClient.post('/logout', {}).subscribe(() => {
      this.router.navigate(['login']);
    });
  }

}
