import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserManagementService {

  constructor(private httpClient: HttpClient) {
  }

  createUser(user: any) {
    return this.httpClient.put('/user-management', user);
  }

  changeUserPassword(userId: number, password: string, passwordAgain: string) {
    return this.httpClient.post('/user-management/change-password', {
      userId: userId,
      password: password,
      passwordAgain: passwordAgain
    });
  }

  changeUserStatus(userId: number, statusId: number): Observable<any> {
    return this.httpClient.post('/user-management/change-user-status', {
      userId: userId,
      statusId: statusId
    });
  }

  getUsers() {
    return this.httpClient.get('/user-management');
  }
}
