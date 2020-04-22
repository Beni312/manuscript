import { interfaces } from 'inversify-express-utils';
import { Resource } from './Resource';
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
    return Promise.resolve(this.details.role === role);
  }

  hasRole(roles: string[]): boolean {
    return roles.indexOf(this.details.role) !== -1;
  }

  isResourceOwner(resource: Resource<any>): Promise<boolean> {
    // TODO ?
    return Promise.resolve(true);
  }
}
