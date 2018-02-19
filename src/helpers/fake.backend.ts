import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { usersData } from './users';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  private users: any[] = usersData;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.of(null).mergeMap(() => {
      if (request.url.endsWith('/j_spring_security_check') && request.method === 'POST') {
        const params = request.body;

        let filteredUser;
        filteredUser = this.users.filter(user => {
          if (user.username === params.username && user.password === params.password) {
            return user;
          }
        });

        if (filteredUser[0]) {
          localStorage.setItem('fakeBackendCurrentUser', filteredUser[0].username);
          return Observable.of(
            new HttpResponse(
              {
                status: 200,
                body: {
                  success: true,
                  session: '54EBC762017F4CCCAFC5B9F175F4E1DE'
                }
              }
            )
          );
        } else {
          return Observable.of(
            new HttpResponse(
              {
                status: 403,
                body: {
                  success: false,
                  errorMessage: 'Wrong username or password. Please try again.(login)'
                }
              }
            )
          );
        }
      }

      if (request.url.endsWith('/application/preload') && request.method === 'POST') {
        let currentUser =localStorage.getItem('fakeBackendCurrentUser');
        console.log('fake backend preloading, currentUser:', currentUser);
        if (currentUser) {
          let user = this.users.filter(user => {
            if (user.username == currentUser) {
              return user;
            }
          });
          return Observable.of(
            new HttpResponse(
              {
                status: 200,
                body: {
                  username: user[0].username,
                  role: user[0].role
                }
              }
            )
          );
        } else {
          return Observable.of(
            new HttpResponse(
              {
                status: 403,
                body: {
                  success: false,
                  errorMessage: 'Wrong username or password. Please try again.(preload)'
                }
              }
            )
          );
        }
      }
      return next.handle(request);
    })
      .materialize()
      .delay(500)
      .dematerialize();
  }
}


export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
