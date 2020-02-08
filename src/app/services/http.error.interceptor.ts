import { catchError } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { MessageService } from './message.service';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private location: Location, private ngZone: NgZone) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
          const messageService = this.injector.get(MessageService);
          const router = this.injector.get(Router);

          if (error.url.includes('login')) {
            return throwError(error.error);
          }

          if (error.status === 401) {
            localStorage.removeItem('currentUser');
            this.ngZone.run(() => {
              messageService.error(error.error);
              return router.navigate(['login']);
            });
          }

          if (error.status === 403) {
            this.ngZone.run(() => {
              messageService.error(error.error);
              this.location.back();
            });
          }

          messageService.error(error.error);
          return throwError(error.error);
        })
      );
  }
}
