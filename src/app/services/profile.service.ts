import { AcademicDiscipline } from '../models/academic.discipline';
import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Password } from '../modules/core/components/registration/registration.component';
import { User } from '../models/user';

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
    return this.httpClient.post<BasicResponse>('/profile/savepersonaldata', user);
  }

  changePassword(changePassword: ChangePassword) {
    return this.httpClient.post<BasicResponse>('/profile/changepassword', changePassword);
  }

  updateAcademicDisciplines(academicDisciplines: AcademicDiscipline[]) {
    return this.httpClient.post<BasicResponse>('/profile/updatedisciplines', academicDisciplines);
  }

  getAcademicDisciplines() {
    return this.httpClient.post<AcademicDiscipline[]>('/application/academicdisciplines', JSON.stringify({}));
  }
}
