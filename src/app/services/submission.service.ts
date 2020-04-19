import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmissionPreloadResponse } from '../models/submission.preload.response';
import { UpsertSubmissionPreload } from '../modules/user/components/submission/submission.upsert/submission.upsert.component';

@Injectable()
export class SubmissionService {

  constructor(private httpClient: HttpClient) {
  }

  preload(): Observable<SubmissionPreloadResponse> {
    return this.httpClient.get<SubmissionPreloadResponse>('/submission/preload');
  }

  remove(id: string) {
    return this.httpClient.post<BasicResponse>('/submission/remove', {submissionId: id});
  }

  getAuthors() {
    return this.httpClient.get('/submission/get-authors');
  }

  create(submission): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/submission/create', submission);
  }
  edit(submission): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/submission/edit', submission);
  }

  evaluate(evaluation): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/submission/evaluate', evaluation);
  }

  upsertSubmissionPreload(): Observable<UpsertSubmissionPreload> {
    return this.httpClient.post<UpsertSubmissionPreload>('/submission/upsert-submission-preload', {});
  }

  submit(submissionId): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/submission/submit', {submissionId: submissionId});
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append(file.name, file, file.name);

    return this.httpClient.post<BasicResponse>('/submission/upload-submission', formData);
  }
}
