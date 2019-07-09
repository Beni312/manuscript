import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector, private ngZone: NgZone) {
  }

  handleError(error: any): void {
    if (error.rejection.status === 401) {
      const router = this.injector.get(Router);
      const messageService = this.injector.get(MessageService);

      localStorage.removeItem('currentUser');
      this.ngZone.run(() => {
        messageService.error(error.rejection.error.exceptionMessage);
        return router.navigate(['login']);
      }).then();
    }
  }
}
