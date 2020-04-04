
import {tap} from 'rxjs/operators';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


export class ProgressInterceptor implements HttpInterceptor {
  constructor(private progressSpinnerService: ProgressSpinnerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressSpinnerService.increase();
    return next
      .handle(req).pipe(
      tap(event => {
          if (event instanceof HttpResponse) {
            this.progressSpinnerService.decrease();
          }
        },
        () => {
          this.progressSpinnerService.decrease();
        }
      ));
  }
}

@Injectable()
export class ProgressSpinnerService {
  public updateProgressSpinner: EventEmitter<any>;

  private requestsRunning = 0;

  constructor() {
    this.updateProgressSpinner = new EventEmitter(true);
  }

  public increase(): void {
    this.requestsRunning++;
    if (this.requestsRunning === 1) {
      this.updateProgressSpinner.emit(true);
    }
  }

  public decrease(): void {
    if (this.requestsRunning > 0) {
      this.requestsRunning--;
      if (this.requestsRunning === 0) {
        this.updateProgressSpinner.emit(false);
      }
    }
  }
}
