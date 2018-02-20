import { Injectable } from '@angular/core';
import { UserRegistration } from '../components/registration/registration.component';
import { HttpClient } from '@angular/common/http';
import { AcademicDiscipline } from '../models/academic.discipline';
import { Observable } from 'rxjs/Observable';
import { BasicResponse } from '../models/basic.response';

@Injectable()
export class RegistrationService {

  constructor(private httpClient: HttpClient) {
  }

  preload(): Observable<AcademicDiscipline[]> {
    return this.httpClient.post<AcademicDiscipline[]>('/registration/preload', JSON.stringify({}))
  }

  register(userRegistration: UserRegistration): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/registration/create', userRegistration);
  }
}
