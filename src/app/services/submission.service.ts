import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SubmissionPreloadResponse } from '../models/submission.preload.response';

@Injectable()
export class SubmissionService {

  constructor(private httpClient: HttpClient) {
  }

  preload(): Observable<SubmissionPreloadResponse> {
    return this.httpClient.post<SubmissionPreloadResponse>('/submission/preload', []);
  }
}
