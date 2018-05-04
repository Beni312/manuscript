import { AcademicDiscipline } from '../models/academic.discipline';
import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserRegistration } from '../modules/core/components/registration/registration.component';

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
