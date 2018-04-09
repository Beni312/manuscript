import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SubmissionPreloadResponse } from '../models/submission.preload.response';

@Injectable()
export class SubmissionService {

  constructor(private httpClient: HttpClient) {
  }

  preload(): Observable<SubmissionPreloadResponse> {
    return this.httpClient.post<SubmissionPreloadResponse>('/submission/preload', []);
  }

  remove(id: string) {
    return this.httpClient.post<BasicResponse>('/submission/remove', id);
  }
}
