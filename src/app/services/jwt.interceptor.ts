import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const cUser = localStorage.getItem('currentUser');
    const options: any = {};

    const currentUser = JSON.parse(cUser);
    if (currentUser && currentUser.token) {
      options.setHeaders = {
        Authorization: `Bearer ${currentUser.token}`
      };
      request = request.clone(options);
    }
    return next.handle(request);
  }
}
