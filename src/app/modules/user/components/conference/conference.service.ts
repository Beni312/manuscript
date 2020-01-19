import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConferenceService {

  constructor(private httpClient: HttpClient) {
  }

  getConferences() {
    return this.httpClient.get('/conference');
  }
}
