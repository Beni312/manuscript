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
import { User } from '../app/models/user';
import { BasicResponse } from '../app/models/basic.response';

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
          return this.getBasicResponse('Wrong username or password. Please try again.(login)', null);
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
          return this.getBasicResponse('Username is already used!', null);
        }

        if (params.password.password !== params.password.passwordAgain) {
          return this.getBasicResponse('Password parity check failed. The given passwords are not matched.', null);
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
        return this.getBasicResponse(null, 'User created');
      }

      if (request.url.endsWith('/logout') && request.method === 'POST') {
        localStorage.removeItem('fakeBackendCurrentUser');
        return this.getBasicResponse(null, 'You are successfully logged out');
      }

      if (request.url.endsWith('/personaldatasettings/preload') && request.method === 'POST') {
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
                  exceptionMessage: null,
                  successMessage: null,
                  user: new User(user.title, user.firstName, user.lastName, user.username, user.job, user.email),
                  academicDisciplines: user.academicDisciplines
                }
              }
            )
          );
        }
      }

      if (request.url.endsWith('/personaldatasettings/savepersonaldata') && request.method === 'POST') {
        let currentUser = localStorage.getItem('fakeBackendCurrentUser');
        if (currentUser) {
          let params = request.body;
          let user = this.users.filter(user => {
            if (user.username == currentUser) {
              return user;
            }
          })[0];
          user.title = params.title;
          user.firstName = params.firstName;
          user.lastName = params.lastName;
          user.job = params.job;
          user.email = params.email;
          return this.getBasicResponse(null, 'Your personal data has been updated successfully!');
        }
      }

      if (request.url.endsWith('/personaldatasettings/changepassword') && request.method === 'POST') {
        let currentUser = localStorage.getItem('fakeBackendCurrentUser');
        if (currentUser) {
          let params = request.body;
          let user = this.users.filter(user => {
            if (user.username == currentUser) {
              return user;
            }
          })[0];

          if (params.password.password != params.password.passwordAgain) {
            return this.getBasicResponse('The given passwords are not matched!', null);
          }
          if (params.password.password != user.password) {
            return this.getBasicResponse('Your password is wrong...', null);
          }
          user.password = params.password.password;
          return this.getBasicResponse(null, 'Your password has changed successfully!');
        }
      }



      return next.handle(request);
    })
      .materialize()
      .delay(500)
      .dematerialize();
  }

  getBasicResponse(exceptionMessage: string, successMessage: string): Observable<HttpResponse<BasicResponse>> {
    return Observable.of(
      new HttpResponse(
        {
          status: 200,
          body: {
            exceptionMessage: exceptionMessage,
            successMessage: successMessage
          }
        }
      )
    );
  }
}


export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
