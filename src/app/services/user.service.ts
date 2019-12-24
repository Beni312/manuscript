import { BasicResponse } from '../models/basic.response';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Preload } from '../models/preload';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  static getPreload(): Preload {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  static isLogined(): boolean {
    return localStorage.getItem('currentUser') != null;
  }

  login(username, password): Observable<BasicResponse> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.httpClient.post<BasicResponse>('/login',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        withCredentials: true
      }
    );
  }

  public preload(): Promise<Preload> {
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

  logout() {
    this.httpClient.post('/logout', {}).subscribe(() => {
      localStorage.removeItem('currentUser');
      this.router.navigate(['login']);
    });
  }
}
