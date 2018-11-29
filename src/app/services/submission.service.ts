import {BasicResponse} from '../models/basic.response';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SubmissionPreloadResponse} from '../models/submission.preload.response';
import {Submission} from "../models/submission";

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

  uploadFile(file: File) {
    console.log(file);
    const formData: FormData = new FormData();
    formData.append(file.name, file, file.name);

    return this.httpClient.post<BasicResponse>('/submission/uploadsubmission', formData);
  }
}
