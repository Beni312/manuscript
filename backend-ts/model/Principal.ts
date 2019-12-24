import { interfaces } from 'inversify-express-utils';
import { UserInfo } from './dto/UserInfo';

export class Principal implements interfaces.Principal {

  details: UserInfo;

  constructor(details: UserInfo | null) {
    if (details) {
      this.details = details;
    }
  }

  isAuthenticated(): Promise<boolean> {
    const isAuthenticated: boolean = this.details && this.details.username !== null;
    return Promise.resolve(isAuthenticated);
  }

  isInRole(role: string): Promise<boolean> {
    // TODO
    return Promise.resolve(true);
  }

  isResourceOwner(resourceId: any): Promise<boolean> {
    // TODO ?
    return Promise.resolve(true);
  }
}
