import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SubmissionPreloadResponse } from '../../../../models/submission.preload.response';
import { Observable } from 'rxjs/Observable';
import { SubmissionService } from '../../../../services/submission.service';

@Injectable()
export class SubmissionPreloadResolver implements Resolve<SubmissionPreloadResponse> {

  constructor(private submissionService: SubmissionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SubmissionPreloadResponse> | Promise<SubmissionPreloadResponse> | SubmissionPreloadResponse {
    return this.submissionService.preload();
  }

}
