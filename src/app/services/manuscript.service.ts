import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManuscriptService {

  constructor(private httpClient: HttpClient) {
  }

  uploadManuscript(formData): Observable<any> {
    return this.httpClient.post('/submission/upload-manuscript', formData);
  }

  downloadManuscript(manuscriptId: number): Observable<any> {
    let params = new HttpParams().set("manuscriptId", manuscriptId.toString());
    return this.httpClient.get('/manuscript/download', {params: params, responseType: 'arraybuffer'});
  }
}
