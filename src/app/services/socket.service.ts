import * as socketIo from 'socket.io-client';
// import { ConfigurationService } from './configuration.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SocketService {
  private socket;

  // constructor(private configService: ConfigurationService) {
  // }

  public initSocket(): void {
    this.socket = socketIo.connect('http://localhost:3000', this.getOptions());
  }

  getOptions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let options: any = {};
    if (currentUser && currentUser.token) {
      options = {
        query: `token=${currentUser.token}`,
        extraHeaders: { Authorization: `${currentUser.token}` }
      };
    }
    return options;
  }

  public sendMessage(message: any): void {
    this.socket.emit('sendMessage', message, this.getOptions());
  }

  public send(endpoint: string, message: any): void {
    this.socket.emit(endpoint, message, this.getOptions());
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data), this.getOptions());
    });
  }

  public onError(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('error', (data: any) => observer.next(data), this.getOptions());
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next(), this.getOptions());
    });
  }
}

