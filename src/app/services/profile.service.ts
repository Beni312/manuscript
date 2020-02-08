import { AcademicDiscipline } from '../models/academic.discipline';
import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Password } from '../models/password';

export class PersonalDataPreload extends BasicResponse {
  user: User;
  academicDisciplines: AcademicDiscipline[];
}

export class ChangePassword {
  password: Password;
  oldPassword: string;
}

@Injectable()
export class ProfileService {

  constructor(private httpClient: HttpClient) {
  }

  preload() {
    return this.httpClient.post<PersonalDataPreload>('/profile/preload', {});
  }

  savePersonalData(user: User) {
    return this.httpClient.post<BasicResponse>('/profile/save-personal-data', user);
  }

  changePassword(changePassword: ChangePassword) {
    return this.httpClient.post<BasicResponse>('/profile/change-password', changePassword);
  }

  updateAcademicDisciplines(academicDisciplines: AcademicDiscipline[]) {
    return this.httpClient.post<BasicResponse>('/profile/update-academic-disciplines', academicDisciplines);
  }

  getAcademicDisciplines() {
    return this.httpClient.post<AcademicDiscipline[]>('/application/academic-disciplines', JSON.stringify({}));
  }
}
