import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalDataPreload, ProfileService } from '../../../../services/profile.service';

@Injectable()
export class PersonalDataPreloadResolver implements Resolve<PersonalDataPreload> {

  constructor(private profileService: ProfileService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PersonalDataPreload> {
    return this.profileService.preload();
  }

}
