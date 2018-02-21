import { AcademicDiscipline } from '../models/academic.discipline';
import { BasicResponse } from '../models/basic.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Password } from '../components/registration/registration.component';

export class PersonalDataPreload extends BasicResponse {
  user: User;
  academicDisciplines: AcademicDiscipline[];
}

export class ChangePassword {
  password: Password;
  oldapassword: string;
}

@Injectable()
export class ProfileService {

  constructor(private httpClient: HttpClient) {
  }

  preload() {
    return this.httpClient.post<PersonalDataPreload>('/personaldatasettings/preload', {});
  }

  savePersonalData(user: User) {
    return this.httpClient.post<BasicResponse>('/personaldatasettings/save', user);
  }

  changePassword(changePassword: ChangePassword) {
    return this.httpClient.post<BasicResponse>('/personaldatasettings/changepassword', changePassword);
  }

  updateAcademicDisciplines(academicDisciplines: AcademicDiscipline[]) {
    return this.httpClient.post<BasicResponse>('/personaldatasettings/updatedisciplines', academicDisciplines);
  }
}
