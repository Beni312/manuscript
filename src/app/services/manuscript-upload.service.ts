import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManuscriptUploadService {

  constructor(private httpClient: HttpClient) {
  }

  uploadManuscript(formData): Observable<any> {
    return this.httpClient.post('/submission/upload-manuscript', formData);
  }
}
