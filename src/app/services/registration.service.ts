import { AcademicDiscipline } from '../models/academic.discipline';
import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterUser } from '../models/register.user';

@Injectable()
export class RegistrationService {

  constructor(private httpClient: HttpClient) {
  }

  preload(): Observable<AcademicDiscipline[]> {
    return this.httpClient.post<AcademicDiscipline[]>('/application/academic-disciplines', JSON.stringify({}));
  }

  register(userRegistration: RegisterUser): Observable<BasicResponse> {
    return this.httpClient.post<BasicResponse>('/register', userRegistration);
  }
}
