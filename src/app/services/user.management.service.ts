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

  changeUserPassword(changePassword: any) {
    return this.httpClient.post('/user-management/change-password', changePassword);
  }

  changeUserStatus(changeUserStatusCommand): Observable<any> {
    return this.httpClient.post('/user-management/change-user-status', changeUserStatusCommand);
  }

  getUsers() {
    return this.httpClient.get('/user-management');
  }
}
