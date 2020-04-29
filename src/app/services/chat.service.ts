import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessagePreload } from '../modules/user/components/messages/messages.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) {
  }

  findUserMessages(): Observable<MessagePreload> {
    return this.httpClient.get<MessagePreload>('/message');
  }
}
