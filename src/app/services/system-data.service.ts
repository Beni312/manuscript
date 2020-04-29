import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemDataState } from '../store/system-data/SystemDataReducer';

@Injectable({
  providedIn: 'root'
})
export class SystemDataService {

  constructor(private httpClient: HttpClient) {
  }

  getSystemData(): Observable<SystemDataState> {
    return this.httpClient.get<SystemDataState>('/application/system-data');
  }
}
