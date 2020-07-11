import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SystemDataState } from '../store/system-data/SystemDataReducer';
import { Store } from '@ngrx/store';
import { InitSystemData } from '../store/system-data/SystemDataActions';

@Injectable({
  providedIn: 'root'
})
export class SystemDataService {

  constructor(private httpClient: HttpClient,
              private readonly store: Store<SystemDataState>) {
  }

  initSystemData(): Promise<void> {
    return this.httpClient.get<SystemDataState>('/application/system-data')
      .toPromise()
      .then((resp: SystemDataState) => {
        this.store.dispatch(new InitSystemData(resp));
      })
      .catch(err => {
        console.log(err);
      });
  }
}
