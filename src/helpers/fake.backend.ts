import { academicDisciplineData } from './academic.disciplines';
import { Author } from '../app/models/author';
import { BasicResponse } from '../app/models/basic.response';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keyword } from '../app/models/keyword';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { submissionData } from './submissions';
import { Submission } from '../app/models/submission';
import { SubmissionPreloadResponse } from '../app/models/submission.preload.response';
import { User } from '../app/models/user';
import { usersData } from './users';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  private users: any[] = usersData;
  private academicDisciplines: any[] = academicDisciplineData;
  private submissions: any[] = submissionData;

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

        // console.log(params);
        // if (!params.user.title || !params.firstName || !params.user.lastName || !params.user.username || !params.user.job || !params.user.email || !params.password.password || !params.password.passwordAgain) {
        //   return this.getBasicResponse('Field is required', null);
        // }

        if (usernameUsed){
          return this.getBasicResponse('Username is already used!', null);
        }

        if (params.password.password !== params.password.passwordAgain) {
          return this.getBasicResponse('Password parity check failed. The given passwords are not matched.', null);
        }

        this.users.push({
          'username': params.user.username,
          'password': params.password.password,
          'role': 'author',
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
          this.users.splice(this.users.indexOf(user), 1);
          user.title = params.user.title;
          user.firstName = params.user.firstName;
          user.lastName = params.user.lastName;
          user.username = params.user.username;
          user.job = params.user.job;
          user.email = params.user.email;
          this.users.push(user);
          localStorage.setItem('fakeBackendCurrentUser', user.username);
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
          if (params.oldPassword != user.password) {
            return this.getBasicResponse('Your password is wrong...', null);
          }
          user.password = params.password.password;
          return this.getBasicResponse(null, 'Your password has changed successfully!');
        }
      }

      if (request.url.endsWith('/submission/preload') && request.method === 'POST') {
        let currentUser = localStorage.getItem('fakeBackendCurrentUser');
        if (currentUser) {
          let user = this.users.filter(user => {
            if (user.username == currentUser) {
              return user;
            }
          })[0];

          let submissions = this.submissions.filter(submission => {
            if (submission.authors.includes(user.userId)) {
              return submission;
            }
          });

          let response: Submission[] = [];
          submissions.forEach(submission => {
            response.push(new Submission(
              submission.submissionId,
              submission.title,
              submission.creationDate,
              submission.lastModifyDate,
              submission.manuscriptAbstract,
              this.getAuthorsByIds(submission.authors),
              <Keyword[]>submission.keywords,
              submission.academicDisciplines,
              this.getUserById(submission.submitter).username));
          });
          return Observable.of(
            new HttpResponse(
              {
                status: 200,
                body: new SubmissionPreloadResponse(response)
              }
            )
          );
        }
      }

      if (request.url.endsWith('/submission/uploadsubmission') && request.method === 'POST') {

      }

      if (request.url.endsWith('/submission/save') && request.method === 'POST') {

      }

      if (request.url.endsWith('/submission/remove') && request.method === 'POST') {
        let submissionId = request.body;
        let isExists = false;
        let hasPermission = false;
        this.submissions = this.submissions.filter(item => {
          if (item.submissionId == submissionId) {
            isExists = true;
            if (this.getUserById(item.submitter).username == localStorage.getItem('fakeBackendCurrentUser')) {
              hasPermission = true;
              return false;
            }
          }
          return true;
        });
        if (!isExists) {
          return this.getBasicResponse('The submission not exists!', 'Submission deleted');
        }
        if (!hasPermission) {
          return this.getBasicResponse('You don' + "'" + 't have permission to delete this submission!', 'Submission deleted');
        }
        return this.getBasicResponse(null, 'Submission deleted');
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

  getUserById(id: number) {
    return this.users.filter(user => {
      if (user.userId == id) {
        return user;
      }
    })[0];
  }

  getUsersByIds(ids: number[]) {
    return this.users.filter(user => {
      if (ids.includes(user.userId)) {
        return new Author(user.userId, user.email, user.firstName, user.lastName);
      }
    });
  }

  getAuthorsByIds(ids: number[]) {
    let authors: Author[] = [];
    this.getUsersByIds(ids).forEach(user => {
      authors.push(new Author(user.userId, user.email, user.firstName, user.lastName));
    });
    return authors;
  }

  getAuthorById(id: number) {
    let user = this.getUserById(id);
    return new Author(user.userId, user.email, user.firstName, user.lastName);
  }
}


export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
