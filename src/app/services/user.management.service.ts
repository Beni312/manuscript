import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserManagementService {

  constructor(private httpClient: HttpClient) {
  }

  getUsers() {
    return this.httpClient.post('/admin/usermanagement', {});
  }
}
