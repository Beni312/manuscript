import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SubmissionPreloadResponse } from '../models/submission.preload.response';
import { Submission } from '../models/submission';
import { UpsertSubmissionPreload } from '../modules/user/components/submission/submission.upsert/submission.upsert.component';

@Injectable()
export class SubmissionService {

  constructor(private httpClient: HttpClient) {
  }

  preload(): Observable<SubmissionPreloadResponse> {
    return this.httpClient.post<SubmissionPreloadResponse>('/submission/preload', []);
  }

  getFilteredByConference(conferenceId: number): Observable<Submission[]> {
    return this.httpClient.post<Submission[]>('/submission/conference', {conferenceId: conferenceId});
  }

  remove(id: string) {
    return this.httpClient.post<BasicResponse>('/submission/remove', {submissionId: id});
  }

  getAuthors() {
    return this.httpClient.post('/submission/getAuthors', {});
  }

  // getMessageTypes() {
  //   return this.httpClient.post('/submission/getMessageTypes', {});
  // }

  edit(submission): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/submission/edit', submission);
  }

  evaluate(evaluation): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/submission/evaluate', evaluation);
  }

  upsertSubmissionPreload(): Observable<UpsertSubmissionPreload> {
    return this.httpClient.post<UpsertSubmissionPreload>('/submission/upsertSubmissionPreload', {});
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append(file.name, file, file.name);

    return this.httpClient.post<BasicResponse>('/submission/uploadsubmission', formData);
  }
}
