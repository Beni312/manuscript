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
import { academicDisciplineData } from './academic.disciplines';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  private users: any[] = usersData;
  private academicDisciplines: any[] = academicDisciplineData;

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
        let currentUser = localStorage.getItem('fakeBackendCurrentUser');
        if (currentUser) {
          let user = this.users.filter(user => {
            if (user.username == currentUser) {
              return user;
            }
          })[0];

          return Observable.of(
            new HttpResponse(
              {
                status: 200,
                body: {
                  username: user.username,
                  role: user.role
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
      if (request.url.endsWith('/registration/preload') && request.method === 'POST') {
        return Observable.of(
          new HttpResponse(
            {
              status: 200,
              body: this.academicDisciplines
            }
          )
        );
      }

      if (request.url.endsWith('/registration/create') && request.method === 'POST') {
        const params = request.body;
        let usernameUsed = false;
        this.users.forEach(item => {
          if (item.username === params.user.username) {
            usernameUsed = true;
          }
        });

        if (usernameUsed){
          return Observable.of(
            new HttpResponse(
              {
                status: 403,
                body: {
                  errors: null,
                  exceptionMessage: 'Username is already used!'
                }
              }
            )
          );
        }
        if (params.password.password !== params.password.passwordAgain) {
          return Observable.of(
            new HttpResponse(
              {
                status: 403,
                body: {
                  errors: null,
                  exceptionMessage: 'Password parity check failed. The given passwords are not matched.'
                }
              }
            )
          );
        }

        this.users.push({
          'username': params.user.username,
          'password': params.password.password,
          'role': 'user',
          'title': params.user.title,
          'firstName': params.user.firstName,
          'lastName': params.user.lastName,
          'job': params.user.job,
          'email': params.user.email,
          'academicDisciplines': params.academicDisciplines
        });
        return Observable.of(
          new HttpResponse(
            {
              status: 200,
              body: {
                success: true,
                successMessage: 'User created'
              }
            }
          )
        );
      }

      if (request.url.endsWith('/logout') && request.method === 'POST') {
        localStorage.removeItem('fakeBackendCurrentUser');
        return Observable.of(
          new HttpResponse(
            {
              status: 200,
              body: {
                success: true
              }
            }
          )
        );
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
