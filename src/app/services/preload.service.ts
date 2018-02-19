import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

export class Preload {
  username: string;
  role: string;
}

@Injectable()
export class PreloadService implements Resolve<Preload>{

  constructor(private httpClient: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Preload> {
    return this.httpClient.post<Preload>('/application/preload', {})
      .toPromise()
      .then(resp => {
        console.log('Preloading...')
        localStorage.setItem('currentUser', JSON.stringify(resp));
        return resp;
      })
      .catch(() => {
        localStorage.removeItem('currentUser');
        return null;
      });
  }
}
